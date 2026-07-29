import { FormEvent, useMemo, useState } from 'react'

type WorkflowKey = 'workspace' | 'social' | 'voice' | 'photos'
type Message = { role: 'user' | 'agent'; text: string }

type Workflow = {
  key: WorkflowKey
  label: string
  signal: string
  eyebrow: string
  prompt: string
  reply: string
  cardTitle: string
  steps: string[]
}

const workflows: Workflow[] = [
  {
    key: 'workspace',
    label: 'Workspace',
    signal: 'Signal 01',
    eyebrow: 'Calendar / Gmail / Drive',
    prompt: 'What meetings do I have today? Send the deck before we meet.',
    reply: 'Maya is at 2:30. I sent the deck from Drive, attached the roof photos, emailed Maya, and added a 20-minute reminder.',
    cardTitle: 'Workspace handled',
    steps: ['Calendar checked', 'Deck sent', 'Maya emailed', 'Reminder added']
  },
  {
    key: 'social',
    label: 'Social',
    signal: 'Signal 02',
    eyebrow: 'Recap / Caption / Schedule',
    prompt: 'How did yesterday do? Make tomorrow special the main post.',
    reply: 'Yesterday hit 50 engagements. I rewrote the special caption, scheduled the post for 9:00 AM, and queued the story for evening.',
    cardTitle: 'Social workflow ready',
    steps: ['Engagement recap', 'Caption rewritten', 'Post scheduled', 'Story queued']
  },
  {
    key: 'voice',
    label: 'Voice',
    signal: 'Signal 03',
    eyebrow: 'Calls / Booking / Summary',
    prompt: 'Can AI answer after-hours calls and book the people who are ready?',
    reply: 'Yes. I answered the call, qualified the lead, booked a consultation, texted confirmation, and saved the morning summary.',
    cardTitle: 'Voice lane active',
    steps: ['Call answered', 'Lead qualified', 'Consultation booked', 'Summary saved']
  },
  {
    key: 'photos',
    label: 'Photos',
    signal: 'Signal 04',
    eyebrow: 'Customers / Folders / Dropbox',
    prompt: 'Here is the customer list from the boat. Set up photo delivery for everyone.',
    reply: 'Receipts and instructions emailed. Desktop export folders are ready. After export, I’ll upload each folder to Dropbox and send links.',
    cardTitle: 'Photo delivery staged',
    steps: ['Receipts emailed', 'Folders created', 'Dropbox staged', 'Links ready']
  }
]

function App() {
  const [activeKey, setActiveKey] = useState<WorkflowKey>('workspace')
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [customMessages, setCustomMessages] = useState<Message[]>([])

  const active = useMemo(
    () => workflows.find((workflow) => workflow.key === activeKey) ?? workflows[0],
    [activeKey]
  )

  const messages = customMessages.length
    ? customMessages
    : [
        { role: 'agent' as const, text: 'Show me something messy and I’ll turn it into completed work.' },
        { role: 'user' as const, text: active.prompt },
        { role: 'agent' as const, text: active.reply }
      ]

  function chooseWorkflow(key: WorkflowKey) {
    setActiveKey(key)
    setTyping(false)
    setCustomMessages([])
    setInput('')
  }

  function sendMessage(event: FormEvent) {
    event.preventDefault()
    const text = input.trim()
    if (!text || typing) return
    setCustomMessages([...messages, { role: 'user', text }])
    setInput('')
    setTyping(true)
    window.setTimeout(() => {
      setCustomMessages((current) => [
        ...current,
        { role: 'agent', text: `Got it. I would route that through the ${active.label.toLowerCase()} workflow, leave a trail, and ask before anything risky goes out.` }
      ])
      setTyping(false)
    }, 720)
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
          <p className="lede">A cinematic phone demo you can actually touch: choose a workflow, send a message, and watch the operator answer like it is moving through real tools.</p>
          <div className="hero-actions" aria-label="Primary actions">
            <a className="action primary" href="mailto:kyle@stayautomatic.com?subject=Map%20my%20first%20AI%20workflow">Map my first workflow</a>
            <a className="action quiet" href="#phone-input">Try the phone</a>
          </div>
        </div>

        <figure className="phone-scene" aria-label="Functional cinematic phone render">
          <img className="phone-shell" src="/generated/sa-functional-phone-shell.png" alt="Photoreal smartphone shell with live Stay Automatic AI operator chat" />
          <div className="live-screen" aria-label="Interactive Stay Automatic phone chat">
            <div className="phone-status"><span>9:41</span><span>5G</span></div>
            <div className="screen-title"><strong>Stay Automatic</strong><small>{active.eyebrow}</small></div>
            <div className="chat-feed" aria-live="polite">
              {messages.slice(-4).map((message, index) => (
                <p className={`chat-bubble ${message.role}`} key={`${message.role}-${index}-${message.text}`}>{message.text}</p>
              ))}
              {typing && <div className="typing" aria-label="AI operator typing"><i /><i /><i /></div>}
              {!typing && <div className="done-card"><span>{active.cardTitle}</span>{active.steps.map((step) => <small key={step}>{step}</small>)}</div>}
            </div>
            <form className="composer" onSubmit={sendMessage}>
              <input id="phone-input" value={input} onChange={(event) => setInput(event.target.value)} placeholder="Ask Stay Automatic…" aria-label="Message Stay Automatic" />
              <button type="submit" aria-label="Send message">↑</button>
            </form>
          </div>
        </figure>

        <aside className="workflow-strip" aria-label="Workflow selection">
          <p className="strip-title">Signals routed through one operator</p>
          <div id="workflow-selector" className="selector" role="tablist" aria-label="Choose workflow demo">
            {workflows.map((workflow, index) => {
              const selected = workflow.key === active.key
              return (
                <button type="button" key={workflow.key} role="tab" aria-selected={selected} className={selected ? 'workflow-mark active' : 'workflow-mark'} onClick={() => chooseWorkflow(workflow.key)}>
                  <span className="index">{workflow.signal}</span>
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
