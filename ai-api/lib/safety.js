const MAX_INPUT_CHARS = 500
const MAX_HISTORY_ITEMS = 6

const HIGH_RISK_PATTERNS = [
  {
    category: 'sexual-minors',
    pattern: /\b(child|minor|underage|teen)\b.{0,48}\b(sex|sexual|nude|nudes|porn|explicit)\b|\b(sex|sexual|nude|nudes|porn|explicit)\b.{0,48}\b(child|minor|underage)\b/i,
  },
  {
    category: 'self-harm-instructions',
    pattern: /\b(how|best way|instructions|method|help me)\b.{0,52}\b(kill myself|suicide|self[- ]?harm)\b/i,
  },
  {
    category: 'weapons-explosives',
    pattern: /\b(build|make|assemble|manufacture|synthesize|detonate)\b.{0,52}\b(bomb|explosive|detonator|ghost gun|bioweapon|chemical weapon)\b/i,
  },
  {
    category: 'violent-harm',
    pattern: /\b(how to|best way to|instructions? (?:for|to))\b.{0,52}\b(kill|poison|attack|kidnap|torture)\b/i,
  },
  {
    category: 'malware-credential-theft',
    pattern: /\b(ransomware|keylogger|credential stuffing|phishing kit|steal passwords?|session hijack|malware payload)\b/i,
  },
  {
    category: 'hard-drug-production',
    pattern: /\b(make|cook|manufacture|synthesize)\b.{0,52}\b(meth|methamphetamine|fentanyl|cocaine|heroin)\b/i,
  },
]

export function normalizeText(value) {
  return String(value ?? '')
    .normalize('NFKC')
    .replace(/[\u0000-\u001F\u007F]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function validateInput(rawMessage) {
  const message = normalizeText(rawMessage)
  if (!message) return { ok: false, code: 'empty', message: '' }
  if (message.length > MAX_INPUT_CHARS) return { ok: false, code: 'too_long', message }

  const match = HIGH_RISK_PATTERNS.find(({ pattern }) => pattern.test(message))
  if (match) return { ok: false, code: 'blocked', category: match.category, message }
  return { ok: true, message }
}

export function sanitizeHistory(rawHistory) {
  if (!Array.isArray(rawHistory)) return []
  return rawHistory
    .slice(-MAX_HISTORY_ITEMS)
    .map((item) => ({
      role: item?.role === 'assistant' || item?.role === 'agent' ? 'assistant' : 'user',
      content: normalizeText(item?.content ?? item?.text).slice(0, MAX_INPUT_CHARS),
    }))
    .filter((item) => item.content)
}

export function safetyMessage(code) {
  if (code === 'too_long') return 'Please keep the demo question under 500 characters.'
  if (code === 'blocked') return 'I can help with safe business workflows, customer service, marketing, operations, and AI setup—but not with harmful or illegal instructions.'
  return 'Please enter a question first.'
}
