import { useEffect, useMemo, useState } from 'react'

const assetPath = (path: string) => `${import.meta.env.BASE_URL}${path}`

type RouteKey = 'chat' | 'handoff' | 'operator' | 'guided'
type DemoRoute = {
  label: string
  headline: string
  body: string
  user: string
  agent: string
  action: string
  result: string
}

const routes: Record<RouteKey, DemoRoute> = {
  chat: {
    label: 'Frontier chat',
    headline: 'Keep it in chat.',
    body: 'Writing, planning, research, and thinking work usually do not need a new system. Use the strongest model and keep the setup light.',
    user: 'I mostly need help thinking and drafting.',
    agent: 'Use frontier chat first. I would not install an operator for this yet.',
    action: 'Draft a reusable prompt kit',
    result: 'Setup map: ChatGPT / Claude + saved prompts',
  },
  handoff: {
    label: 'Simple automation',
    headline: 'Make one clean handoff.',
    body: 'If the work is predictable — a form to a sheet, a lead to an email, a reminder to a calendar — use a simple automation before bringing in an agent.',
    user: 'One app needs to hand something to another app.',
    agent: 'This is a rule, not a worker. Keep it simple and make the failure path obvious.',
    action: 'Map trigger → action → fallback',
    result: 'Setup map: Zapier / Make / script lane',
  },
  operator: {
    label: 'Owned operator',
    headline: 'Give the assistant a computer.',
    body: 'When the work touches inboxes, files, browsers, reports, memory, schedules, and approval gates, a Hermes operator on a cloud computer starts to make sense.',
    user: 'Inbox, files, browser steps, reports, and follow-up.',
    agent: 'Operator-ready. I would put this on a small cloud computer with tools, memory, schedules, and human approvals.',
    action: 'Create operator brief + first workflow',
    result: 'Setup map: Hermes cloud operator',
  },
  guided: {
    label: 'Guided setup',
    headline: 'Design the approval gate first.',
    body: 'Customer replies, money, public claims, or sensitive data need a reviewed path before anything gets automated.',
    user: 'Customer replies or money-related work.',
    agent: 'Start with the human review gate. Then automate the draft, routing, files, and follow-up around it.',
    action: 'Draft approval path + safe handoff',
    result: 'Setup map: guided workflow sprint',
  },
}

const prompts: Array<{ label: string; key: RouteKey }> = [
  { label: 'Inbox and follow-up', key: 'operator' },
  { label: 'Customer replies', key: 'guided' },
  { label: 'Reports and files', key: 'operator' },
  { label: 'One app handoff', key: 'handoff' },
  { label: 'Writing and planning', key: 'chat' },
]

function App() {
  const [active, setActive] = useState<RouteKey>('operator')
  const [selectedPrompt, setSelectedPrompt] = useState('Inbox and follow-up')
  const route = useMemo(() => routes[active], [active])

  useEffect(() => {
    document.title = 'Stay Automatic — AI setup, through chat'
  }, [])

  const choosePrompt = (prompt: { label: string; key: RouteKey }) => {
    setActive(prompt.key)
    setSelectedPrompt(prompt.label)
  }

  return (
    <main className="site-frame">
      <div className="grain" />
      <header className="masthead">
        <a className="wordmark" href="/"><span>Stay</span> Automatic</a>
        <nav>
          <a href="mailto:kyle@stayautomatic.com?subject=Stay%20Automatic%20setup%20map">Request access</a>
        </nav>
      </header>

      <section className="hero" aria-label="Stay Automatic AI setup chat demo">
        <div className="copy-column">
          <p className="kicker">A setup map, not another AI dashboard.</p>
          <h1>Catch up to AI without buying another app.</h1>
          <p className="lede">
            Stay Automatic turns one messy workflow into a clear AI setup map: what to handle in ChatGPT or Claude, what to automate, and when it is worth giving an assistant its own cloud computer.
          </p>

          <div className="actions" aria-label="Primary actions">
            <a className="button primary" href="mailto:kyle@stayautomatic.com?subject=I%20want%20my%20AI%20setup%20map">Map my first workflow</a>
            <a className="button ghost" href="mailto:kyle@stayautomatic.com?subject=Show%20me%20the%20workflow%20library">Preview the library</a>
          </div>

          <div className="principles" aria-label="Positioning principles">
            <span>No generic AI audit</span>
            <span>No wrapper stack</span>
            <span>Human approval gates</span>
          </div>
        </div>

        <figure className="phone-showcase">
          <div className="render-halo" />
          <img src={assetPath('generated/stay-automatic-chat-phone-render.png')} alt="Premium phone render showing a Stay Automatic chat asking what kind of work an AI operator should handle first." />
          <div className="live-screen" aria-label="Interactive chat demo inside the phone render">
            <div className="live-header">
              <span className="avatar">SA</span>
              <div><strong>Stay Automatic</strong><small>setup agent online</small></div>
            </div>
            <div className="chat-stack" key={selectedPrompt}>
              <p className="bubble agent">What kind of work should your AI operator handle first?</p>
              <p className="bubble user">{route.user}</p>
              <p className="bubble agent">{route.agent}</p>
              <div className="action-card">
                <span>Next move</span>
                <strong>{route.action}</strong>
                <em>{route.result}</em>
              </div>
            </div>
            <div className="composer"><span>Message Stay Automatic…</span><button aria-label="send demo message">↑</button></div>
          </div>
        </figure>

        <aside className="diagnostic-card" aria-live="polite">
          <div className="card-topline">
            <span>Live recommendation</span>
            <strong>{route.label}</strong>
          </div>
          <h2>{route.headline}</h2>
          <p>{route.body}</p>
          <div className="prompt-list" aria-label="Example chat answers">
            {prompts.map((prompt) => (
              <button key={prompt.label} className={selectedPrompt === prompt.label ? 'selected' : ''} onClick={() => choosePrompt(prompt)}>
                {prompt.label}
              </button>
            ))}
          </div>
        </aside>
      </section>
    </main>
  )
}

export default App
