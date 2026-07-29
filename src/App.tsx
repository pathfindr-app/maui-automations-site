import { useEffect, useMemo, useState } from 'react'

type WorkflowKey = 'workspace' | 'social' | 'voice' | 'photos'
type Workflow = {
  label: string
  eyebrow: string
  prompt: string
  reply: string
  actionTitle: string
  actions: string[]
  sideTitle: string
  sideCopy: string
}

const assetPath = (path: string) => `${import.meta.env.BASE_URL}${path}`

const workflows: Record<WorkflowKey, Workflow> = {
  workspace: {
    label: 'Google Workspace',
    eyebrow: 'Calendar · Gmail · Docs',
    prompt: 'What meetings do I have today? Send the deck and roof photos to Maya before we meet.',
    reply: 'Maya is at 2:30. I sent the deck, attached the roof photos, added the claim note, and left you a 20-minute reminder.',
    actionTitle: 'Done across Calendar, Gmail, and Drive',
    actions: ['Calendar checked', 'Docs attached', 'Email sent', 'Reminder added'],
    sideTitle: 'AI that reaches into your actual workspace.',
    sideCopy: 'This is the difference between chat and leverage: the agent checks the calendar, finds the file, sends the email, and leaves a trail.',
  },
  social: {
    label: 'Social recap + posting',
    eyebrow: 'Recap · Caption · Schedule',
    prompt: 'How did yesterday’s post do? Make tomorrow’s special the main post instead.',
    reply: 'Yesterday had 50 engagements and 7 replies. I rewrote tomorrow’s caption around the special, scheduled it for 8:15 AM, and queued the story version.',
    actionTitle: 'Social workflow prepared',
    actions: ['Engagement recap', 'Caption revised', 'Post scheduled', 'Story queued'],
    sideTitle: 'Reports are only useful when they turn into action.',
    sideCopy: 'The agent gives the daily read, takes the next instruction, writes the caption, schedules the post, and closes the loop.',
  },
  voice: {
    label: 'After-hours calls',
    eyebrow: 'Voice · Booking · Summary',
    prompt: 'Can AI answer after-hours calls and book the people who are ready?',
    reply: 'Yes. It can answer, qualify the caller, offer open times, book the call, text confirmation, and send you a morning summary.',
    actionTitle: 'Voice intake lane',
    actions: ['Call answered', 'Lead qualified', 'Time booked', 'Summary sent'],
    sideTitle: 'Voice becomes an operator lane, not a novelty.',
    sideCopy: 'A useful voice agent has rules, calendar access, escalation points, and summaries — not just a talking bot that creates cleanup.',
  },
  photos: {
    label: 'Photo delivery',
    eyebrow: 'Customer list · Folders · Dropbox',
    prompt: 'Here is the customer list from the boat. Set up photo delivery for everyone.',
    reply: 'I emailed receipts and instructions, created export folders on the desktop, and I’m ready to upload each customer folder to Dropbox after export.',
    actionTitle: 'Photo delivery prepared',
    actions: ['Receipts emailed', 'Folders created', 'Dropbox queued', 'Links ready'],
    sideTitle: 'Messy customer lists become fulfilled work.',
    sideCopy: 'The operator accepts rough input, prepares the workspace, waits at the right checkpoint, then finishes delivery cleanly.',
  },
}

const order: WorkflowKey[] = ['workspace', 'social', 'voice', 'photos']

function PhoneScreen({ active, visible, typing }: { active: Workflow; visible: Workflow; typing: boolean }) {
  return (
    <div className="screen-ui">
      <div className="screen-top"><span>9:41</span><span>5G</span></div>
      <div className="chat-head"><strong>Stay Automatic</strong><small>operator online</small></div>
      <div className="chat-feed" key={`${active.label}-${visible.label}-${typing ? 'typing' : 'done'}`}>
        <p className="bubble agent">Show me what AI can actually do for my business.</p>
        <p className="bubble user">{active.prompt}</p>
        {typing ? (
          <div className="typing" aria-label="Agent is typing"><i /><i /><i /></div>
        ) : (
          <>
            <p className="bubble agent">{visible.reply}</p>
            <div className="action-card">
              <span>Workflow completed</span>
              <strong>{visible.actionTitle}</strong>
              <ul>{visible.actions.map((action) => <li key={action}>{action}</li>)}</ul>
            </div>
          </>
        )}
      </div>
      <div className="composer"><span>Ask Stay Automatic…</span><button aria-label="Send">↑</button></div>
    </div>
  )
}

function App() {
  const [selected, setSelected] = useState<WorkflowKey>('workspace')
  const [visible, setVisible] = useState<WorkflowKey>('workspace')
  const [typing, setTyping] = useState(false)
  const selectedWorkflow = useMemo(() => workflows[selected], [selected])
  const visibleWorkflow = useMemo(() => workflows[visible], [visible])

  useEffect(() => {
    document.title = 'Stay Automatic — Real AI operator demos'
  }, [])

  function choose(key: WorkflowKey) {
    if (key === selected) return
    setSelected(key)
    setTyping(true)
    window.setTimeout(() => {
      setVisible(key)
      setTyping(false)
    }, 760)
  }

  return (
    <main className="page-shell">
      <header className="topbar">
        <a className="brand" href="/"><span>Stay</span> Automatic</a>
        <a className="access" href="mailto:kyle@stayautomatic.com?subject=Show%20me%20the%20real%20power%20of%20AI">Request access</a>
      </header>

      <section className="hero" aria-label="Stay Automatic AI operator demo">
        <div className="copy">
          <p className="kicker">Real workflows. Real tools. Real leverage.</p>
          <h1>Let us show you the real power of AI.</h1>
          <p className="lede">Pick a workflow and watch an AI operator move through real business tools: Gmail, Calendar, Docs, social posts, calls, customer folders, approvals, and delivery.</p>
          <div className="cta-row">
            <a className="button primary" href="mailto:kyle@stayautomatic.com?subject=Map%20my%20first%20AI%20workflow">Map my first workflow</a>
            <a className="button ghost" href="mailto:kyle@stayautomatic.com?subject=Preview%20Stay%20Automatic%20workflow%20library">Preview workflow library</a>
          </div>
        </div>

        <section className="render-stage" aria-label="Premium phone render with live operator chat">
          <img className="phone-render" src={assetPath('generated/stay-automatic-premium-phone-shell.png')} alt="Premium phone showing Stay Automatic AI operator chat" />
          <div className="screen-portal">
            <PhoneScreen active={selectedWorkflow} visible={visibleWorkflow} typing={typing} />
          </div>
        </section>

        <aside className="control-card" aria-live="polite">
          <p className="label">Live workflow</p>
          <h2>{typing ? 'The operator is working…' : visibleWorkflow.sideTitle}</h2>
          <p>{typing ? 'It is choosing the tools, preparing the next action, and waiting where human approval matters.' : visibleWorkflow.sideCopy}</p>
          <div className="workflow-list" aria-label="Choose workflow demo">
            {order.map((key) => (
              <button key={key} className={selected === key ? 'active' : ''} onClick={() => choose(key)}>
                <span>{workflows[key].label}</span>
                <small>{workflows[key].eyebrow}</small>
              </button>
            ))}
          </div>
        </aside>
      </section>
    </main>
  )
}

export default App
