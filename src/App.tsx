import { FormEvent, useMemo, useState } from 'react'

type WorkflowKey = 'workspace' | 'social' | 'voice' | 'photos'
type Message = { role: 'user' | 'agent'; text: string }

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
    reply: 'Maya is at 2:30. I found the deck in Drive, attached yesterday’s roof photos, emailed both to Maya, and added a reminder with the call notes 20 minutes before the meeting.',
    cardTitle: 'Workspace work completed',
    steps: ['Calendar checked', 'Drive file found', 'Email sent', 'Reminder added']
  },
  {
    key: 'social',
    label: 'Social posting',
    eyebrow: 'Photo · Caption · Schedule · Recap',
    prompt: 'This is a really nice post. Go ahead and work it into our posting schedule tomorrow.',
    reply: 'Done. I cropped the customer photo, wrote a warm caption, added tomorrow’s special, scheduled the feed post for 9:00 AM, queued a story version for 6:00 PM, and saved the performance note for tomorrow’s recap.',
    cardTitle: 'Post prepared for tomorrow',
    steps: ['Image selected', 'Caption written', 'Feed scheduled', 'Story queued'],
    media: '/generated/sa-social-customer-thumb.png',
    mediaAlt: 'Customer giving a thumbs-up while eating pizza'
  },
  {
    key: 'voice',
    label: 'After-hours calls',
    eyebrow: 'Voice · Booking · Text · Summary',
    prompt: 'Can AI answer calls after hours and book the people who are ready?',
    reply: 'Yes. I answered the missed call, asked the qualification questions, booked the consultation, texted the customer a confirmation, and wrote the morning summary so you can review it before opening.',
    cardTitle: 'Voice lane ready',
    steps: ['Call answered', 'Lead qualified', 'Booking made', 'Summary saved']
  },
  {
    key: 'photos',
    label: 'Photo delivery',
    eyebrow: 'Customers · Folders · Dropbox · Links',
    prompt: 'Here is the customer list from the boat. Set up photo delivery for everyone.',
    reply: 'Receipts and instructions are emailed. I created desktop export folders for each customer. When the edits are exported, I’ll upload each folder to Dropbox and send every customer their private link.',
    cardTitle: 'Delivery workflow staged',
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
        { role: 'agent' as const, text: 'Tell me what you want done. I’ll turn the request into steps and keep a clear trail.' },
        { role: 'user' as const, text: active.prompt },
        { role: 'agent' as const, text: active.reply }
      ]

  function chooseWorkflow(key: WorkflowKey) {
    setActiveKey(key)
    setTyping(false)
    setCustomMessages([])
    setInput('')
  }

  const visibleMessages = active.media ? messages.slice(-2) : messages.slice(-3)

  function sendMessage(event: FormEvent) {
    event.preventDefault()
    const text = input.trim()
    if (!text || typing) return
    setCustomMessages([{ role: 'user', text }])
    setInput('')
    setTyping(true)
    window.setTimeout(() => {
      setCustomMessages((current) => [
        ...current,
        { role: 'agent', text: `Yes. I’d start with the ${active.label.toLowerCase()} workflow, confirm the risky parts with you, then draft the exact tools, accounts, permissions, and automations needed to make it real.` }
      ])
      setTyping(false)
    }, 760)
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
            <a className="action quiet" href="#phone-input">Ask the demo</a>
          </div>
        </div>

        <figure className="phone-scene" aria-label="Functional cinematic phone render">
          <img className="phone-shell" src="/generated/sa-functional-phone-shell.png" alt="Photoreal smartphone shell with live Stay Automatic AI operator chat" />
          <div className="live-screen" aria-label="Interactive Stay Automatic phone chat">
            <div className="phone-status"><span>9:41</span><span>5G</span></div>
            <div className="screen-title"><strong>Stay Automatic</strong><small>{active.eyebrow}</small></div>
            <div className="chat-feed" aria-live="polite">
              {active.media && <img className="message-photo" src={active.media} alt={active.mediaAlt ?? ''} />}
              {visibleMessages.map((message, index) => (
                <p className={`chat-bubble ${message.role}`} key={`${message.role}-${index}-${message.text}`}>{message.text}</p>
              ))}
              {typing && <div className="typing" aria-label="AI operator typing"><i /><i /><i /></div>}
              {!typing && <div className="done-card"><span>{active.cardTitle}</span>{active.steps.map((step) => <small key={step}>{step}</small>)}</div>}
            </div>
          </div>

          <form className="ask-bar" onSubmit={sendMessage} aria-label="Ask Stay Automatic by text or voice">
            <span className="voice-pill" aria-hidden="true">Voice + text</span>
            <input id="phone-input" value={input} onChange={(event) => setInput(event.target.value)} placeholder="Ask what AI could do for your business…" aria-label="Ask Stay Automatic" />
            <button className="mic-button" type="button" aria-label="Voice input preview">◦</button>
            <button className="send-button" type="submit" aria-label="Send message">↑</button>
          </form>
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
