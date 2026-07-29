import { createHash, randomUUID } from 'node:crypto'
import { safetyMessage, sanitizeHistory, validateInput } from '../lib/safety.js'

const WINDOW_MS = 10 * 60 * 1000
const MAX_REQUESTS_PER_WINDOW = 12
const buckets = new Map()

function allowedOrigins() {
  return new Set((process.env.ALLOWED_ORIGINS || 'https://stayautomatic.com,https://www.stayautomatic.com,http://localhost:5173,http://127.0.0.1:5173,http://127.0.0.1:5188')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean))
}

function setCors(req, res) {
  const origin = String(req.headers.origin || '')
  if (allowedOrigins().has(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin)
    res.setHeader('Vary', 'Origin')
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  res.setHeader('Cache-Control', 'no-store')
  res.setHeader('X-Content-Type-Options', 'nosniff')
  return !origin || allowedOrigins().has(origin)
}

function clientKey(req) {
  const forwarded = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim()
  const source = forwarded || req.socket?.remoteAddress || 'unknown'
  return createHash('sha256').update(source).digest('hex').slice(0, 20)
}

function isRateLimited(req) {
  const now = Date.now()
  const key = clientKey(req)
  const bucket = buckets.get(key)
  if (!bucket || now - bucket.startedAt >= WINDOW_MS) {
    buckets.set(key, { startedAt: now, count: 1 })
    return false
  }
  bucket.count += 1
  return bucket.count > MAX_REQUESTS_PER_WINDOW
}

export default async function handler(req, res) {
  const requestId = randomUUID()
  const originAllowed = setCors(req, res)

  if (req.method === 'OPTIONS') return res.status(204).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed.', requestId })
  if (!originAllowed) return res.status(403).json({ error: 'Origin not allowed.', requestId })
  if (isRateLimited(req)) return res.status(429).json({ error: 'The demo has received too many requests. Please wait a few minutes.', requestId })

  const contentLength = Number(req.headers['content-length'] || 0)
  if (contentLength > 12_000) return res.status(413).json({ error: 'Request too large.', requestId })

  let body
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {})
  } catch {
    return res.status(400).json({ error: 'Invalid JSON request.', requestId })
  }

  const checked = validateInput(body.message)
  if (!checked.ok) {
    return res.status(400).json({ error: safetyMessage(checked.code), blocked: checked.code === 'blocked', requestId })
  }

  const bridgeUrl = String(process.env.HERMES_BRIDGE_URL || '').replace(/\/$/, '')
  const bridgeKey = process.env.HERMES_BRIDGE_KEY
  if (!bridgeUrl || !bridgeKey) return res.status(503).json({ error: 'The AI demo is not configured yet.', requestId })

  const history = sanitizeHistory(body.history)
  const workflow = typeof body.workflow === 'string' ? body.workflow.slice(0, 80) : 'general business workflow'
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 82_000)

  try {
    const upstream = await fetch(`${bridgeUrl}/chat`, {
      method: 'POST',
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${bridgeKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: checked.message, workflow, history }),
    })

    const payload = await upstream.json().catch(() => ({}))
    if (!upstream.ok) {
      console.error('Hermes bridge request failed', { requestId, status: upstream.status, blocked: Boolean(payload.blocked) })
      if (payload.blocked) return res.status(400).json({ error: safetyMessage('blocked'), blocked: true, requestId })
      if (upstream.status === 429) return res.status(429).json({ error: 'The assistant is busy. Please try again shortly.', requestId })
      if (upstream.status === 504) return res.status(504).json({ error: 'The AI took too long to answer. Please try again.', requestId })
      return res.status(502).json({ error: 'The AI service is temporarily unavailable.', requestId })
    }

    const answer = typeof payload.answer === 'string' ? payload.answer.trim() : ''
    if (!answer) return res.status(502).json({ error: 'The AI returned an empty response.', requestId })
    return res.status(200).json({ answer: answer.slice(0, 1400), requestId })
  } catch (error) {
    const timedOut = error instanceof Error && error.name === 'AbortError'
    console.error('Hermes bridge connection error', { requestId, timedOut })
    return res.status(timedOut ? 504 : 500).json({ error: timedOut ? 'The AI took too long to answer. Please try again.' : 'The AI demo hit an unexpected error.', requestId })
  } finally {
    clearTimeout(timeout)
  }
}
