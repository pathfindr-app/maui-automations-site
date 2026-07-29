import { FormEvent, useMemo, useRef, useState } from 'react'

type WorkflowKey = 'workspace' | 'social' | 'voice' | 'photos'
type Message = { role: 'user' | 'agent'; text: string }
type SpeechRecognitionLike = {
  continuous: boolean
  interimResults: boolean
  lang: string
  start: () => void
  stop: () => void
  onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null
  onend: (() => void) | null
  onerror: ((event: { error?: string }) => void) | null
}

type Workflow = {
  key: WorkflowKey
  label: string
  eyebrow: string
  prompt: string
  reply: string
  cardTitle: string
  steps: string[]
  media?: string
  mediaAlt?: string
}

const workflows: Workflow[] = [
  {
    key: 'workspace',
    label: 'Google Workspace',
    eyebrow: 'Calendar · Gmail · Drive · Docs',
    prompt: 'What meetings do I have today? Send the deck and roof photos to Maya before we meet.',
    reply: 'Maya is at 2:30. I found the deck in Drive, attached yesterday’s roof photos, emailed both to Maya, and added a 20-minute reminder with the call notes.',
    cardTitle: 'Workspace completed',
    steps: ['Calendar checked', 'Drive file found', 'Email sent', 'Reminder added']
  },
  {
    key: 'social',
    label: 'Social posting',
    eyebrow: 'Photo · Caption · Schedule · Recap',
    prompt: 'This is a really nice post. Go ahead and work it into our posting schedule tomorrow.',
    reply: 'Done. I cropped the customer photo, wrote a warm caption, added tomorrow’s special, scheduled the feed post for 9:00 AM, queued a story version for 6:00 PM, and saved a note for tomorrow’s recap.',
    cardTitle: 'Post ready for tomorrow',
    steps: ['Image selected', 'Caption written', 'Feed scheduled', 'Story queued'],
    media: '/generated/sa-social-customer-thumb.png',
    mediaAlt: 'Customer giving a thumbs-up while eating pizza'
  },
  {
    key: 'voice',
    label: 'After-hours calls',
    eyebrow: 'Voice · Booking · Text · Summary',
    prompt: 'Can AI answer calls after hours and book the people who are ready?',
    reply: 'Yes. I answered the missed call, asked the qualification questions, booked the consultation, texted the customer confirmation, and wrote the morning summary.',
    cardTitle: 'Call lane ready',
    steps: ['Call answered', 'Lead qualified', 'Booking made', 'Summary saved']
  },
  {
    key: 'photos',
    label: 'Photo delivery',
    eyebrow: 'Customers · Folders · Dropbox · Links',
    prompt: 'Here is the customer list from the boat. Set up photo delivery for everyone.',
    reply: 'Receipts and instructions are emailed. I created export folders for each customer; after export I’ll upload to Dropbox and send private links.',
    cardTitle: 'Delivery staged',
    steps: ['Receipts emailed', 'Folders created', 'Dropbox staged', 'Links ready']
  }
]

function App() {
  const [activeKey, setActiveKey] = useState<WorkflowKey>('workspace')
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [customMessages, setCustomMessages] = useState<Message[]>([])
  const [voiceState, setVoiceState] = useState<'idle' | 'listening' | 'unsupported' | 'error'>('idle')
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null)

  const active = useMemo(
    () => workflows.find((workflow) => workflow.key === activeKey) ?? workflows[0],
    [activeKey]
  )

  const messages = customMessages.length
    ? customMessages
    : [
        { role: 'agent' as const, text: 'Send me what you want done. I’ll turn it into a working first step.' },
        { role: 'user' as const, text: active.prompt },
        { role: 'agent' as const, text: active.reply }
      ]

  const visibleMessages = active.media ? messages.slice(-2) : messages.slice(-3)

  function chooseWorkflow(key: WorkflowKey) {
    setActiveKey(key)
    setTyping(false)
    setCustomMessages([])
    setInput('')
    setVoiceState('idle')
  }

  function answerFor(text: string) {
    const lower = text.toLowerCase()
    if (lower.includes('restaurant') || active.key === 'social') {
      return 'For a restaurant, I’d start with a Telegram-based social workflow: collect good customer photos, draft captions in your voice, schedule the post, then recap what actually brought people in.'
    }
    if (lower.includes('call') || lower.includes('phone') || active.key === 'voice') {
      return 'I’d start with after-hours calls: answer, qualify, book the good leads, text confirmation, and give you a clean morning summary before you open.'
    }
    if (lower.includes('photo') || active.key === 'photos') {
      return 'I’d start with photo delivery: customer list in, folders made, files uploaded, private links sent, and a fulfilled/not-fulfilled trail you can trust.'
    }
    return `I’d map the first ${active.label.toLowerCase()} workflow: trigger, tools, permissions, approval points, and the smallest version that can do real work this week.`
  }

  function sendText(text: string) {
    const clean = text.trim()
    if (!clean || typing) return
    setCustomMessages([{ role: 'user', text: clean }])
    setInput('')
    setVoiceState('idle')
    setTyping(true)
    window.setTimeout(() => {
      setCustomMessages((current) => [...current, { role: 'agent', text: answerFor(clean) }])
      setTyping(false)
    }, 720)
  }

  function sendMessage(event: FormEvent) {
    event.preventDefault()
    sendText(input)
  }

  function startVoice() {
    const SpeechRecognition = (window as unknown as { SpeechRecognition?: new () => SpeechRecognitionLike; webkitSpeechRecognition?: new () => SpeechRecognitionLike }).SpeechRecognition
      ?? (window as unknown as { webkitSpeechRecognition?: new () => SpeechRecognitionLike }).webkitSpeechRecognition
    if (!SpeechRecognition) {
      setVoiceState('unsupported')
      setInput('Voice is not supported in this browser. Type your question here.')
      return
    }
    const recognition = new SpeechRecognition()
    recognitionRef.current = recognition
    recognition.continuous = false
    recognition.interimResults = false
    recognition.lang = 'en-US'
    recognition.onresult = (event) => {
      const transcript = event.results[0]?.[0]?.transcript ?? ''
      setInput(transcript)
      if (transcript) sendText(transcript)
    }
    recognition.onerror = () => setVoiceState('error')
    recognition.onend = () => setVoiceState((current) => current === 'listening' ? 'idle' : current)
    setVoiceState('listening')
    recognition.start()
  }

  return (
    <main className="page-shell">
      <header className="masthead" aria-label="Stay Automatic navigation">
        <a href="/" className="brand" aria-label="Stay Automatic home"><span>Stay</span> Automatic</a>
        <a href="mailto:kyle@stayautomatic.com" className="access-link">Request access</a>
      </header>

      <section className="hero" aria-label="Stay Automatic interactive AI operator phone demo">
        <div className="editorial-copy">
          <p className="overline">AI, shown as work</p>
          <h1>Let us show you the real power of AI.</h1>
          <p className="lede">Stay Automatic helps you decide what to build first, choose the tools for a capable AI tech stack, and turn one real workflow into something that can actually get work done. Start with a quick guide, get a custom setup map, or have us build it with you.</p>
          <div className="hero-actions" aria-label="Primary actions">
            <a className="action primary" href="mailto:kyle@stayautomatic.com?subject=Map%20my%20first%20AI%20workflow">Map my first workflow</a>
            <a className="action quiet" href="#phone-input">Try the Telegram demo</a>
          </div>
        </div>

        <figure className="phone-scene" aria-label="Photoreal phone with Telegram-style chat">
          <img className="phone-shell" src="/generated/sa-functional-phone-shell.png" alt="Photoreal smartphone shell with live Telegram-style Stay Automatic chat" />
          <div className="telegram-screen" aria-label="Telegram-style Stay Automatic chat">
            <div className="tg-status"><span>9:41</span><span>5G</span></div>
            <div className="tg-header">
              <span className="tg-back">‹</span>
              <span className="tg-logo">✈</span>
              <span className="tg-title"><strong>Stay Automatic</strong><small>online · Telegram demo</small></span>
              <span className="tg-menu">•••</span>
            </div>
            <div className="tg-thread" aria-live="polite">
              <span className="tg-date">Today</span>
              {active.media && <img className="tg-photo" src={active.media} alt={active.mediaAlt ?? ''} />}
              {visibleMessages.map((message, index) => (
                <div className={`tg-row ${message.role}`} key={`${message.role}-${index}-${message.text}`}>
                  {message.role === 'agent' && <span className="msg-avatar sa">SA</span>}
                  <p className={`tg-bubble ${message.role}`}>{message.text}<small>{message.role === 'user' ? '✓✓' : '9:41'}</small></p>
                  {message.role === 'user' && <span className="msg-avatar you">You</span>}
                </div>
              ))}
              {typing && <div className="tg-row agent"><span className="msg-avatar sa">SA</span><div className="typing" aria-label="Stay Automatic typing"><i /><i /><i /></div></div>}
              {!typing && <div className="tg-checks">{active.steps.map((step) => <span key={step}>✓ {step}</span>)}</div>}
            </div>
          </div>

          <form className="ask-bar" onSubmit={sendMessage} aria-label="Ask Stay Automatic by text or voice">
            <button className={voiceState === 'listening' ? 'mic-button listening' : 'mic-button'} type="button" onClick={startVoice} aria-label="Start voice input">🎙</button>
            <input id="phone-input" value={input} onChange={(event) => setInput(event.target.value)} placeholder={voiceState === 'listening' ? 'Listening…' : 'Ask by voice or text, like Telegram…'} aria-label="Ask Stay Automatic" />
            <button className="send-button" type="submit" aria-label="Send message">➤</button>
          </form>
          {voiceState === 'unsupported' && <p className="voice-note">Voice input needs browser speech recognition. Text still works here.</p>}
          {voiceState === 'error' && <p className="voice-note">Voice permission failed or was blocked. Text still works here.</p>}
        </figure>

        <aside className="workflow-strip" aria-label="Workflow examples">
          <p className="strip-title">Examples of what AI can do</p>
          <div id="workflow-selector" className="selector" role="tablist" aria-label="Choose workflow demo">
            {workflows.map((workflow) => {
              const selected = workflow.key === active.key
              return (
                <button type="button" key={workflow.key} role="tab" aria-selected={selected} className={selected ? 'workflow-mark active' : 'workflow-mark'} onClick={() => chooseWorkflow(workflow.key)}>
                  <span className="mark-copy"><strong>{workflow.label}</strong><small>{workflow.eyebrow}</small></span>
                </button>
              )
            })}
          </div>
        </aside>
      </section>
    </main>
  )
}

export default App
