import { useEffect, useMemo, useState } from 'react'

type RouteKey = 'operator' | 'guided' | 'handoff' | 'chat'
type Route = {
  label: string
  eyebrow: string
  headline: string
  body: string
  user: string
  agent: string
  plan: string
  steps: string[]
}

const routes: Record<RouteKey, Route> = {
  operator: {
    label: 'Cloud operator',
    eyebrow: 'Messy recurring work',
    headline: 'The assistant gets a computer.',
    body: 'Inbox, files, browser steps, reports, reminders, and approval gates belong on an owned operator — not trapped in another rented dashboard.',
    user: 'Inbox, files, browser steps, reports, and follow-up.',
    agent: 'Operator-ready. I would put this on a small cloud computer with tools, memory, schedules, and human approvals.',
    plan: 'Cloud operator workflow',
    steps: ['Watch inbox', 'Draft follow-up', 'Attach files', 'Ask before send'],
  },
  guided: {
    label: 'Approval gate',
    eyebrow: 'Customer replies',
    headline: 'Human review stays in the loop.',
    body: 'The operator prepares the reply and context, then stops at the line where a person should make the call.',
    user: 'Customer replies and follow-up.',
    agent: 'Start with approvals. I can draft replies, prepare context, and wait for your send.',
    plan: 'Approval gate first',
    steps: ['Read customer thread', 'Prepare context', 'Draft reply', 'Wait for approval'],
  },
  handoff: {
    label: 'Clean automation',
    eyebrow: 'Predictable handoffs',
    headline: 'Do not over-agent a simple rule.',
    body: 'If the workflow is one trigger and one action, Stay Automatic maps the clean automation and the fallback instead of adding complexity.',
    user: 'One app needs to hand something to another app.',
    agent: 'This is a simple automation, not an agent. I’ll map trigger, action, and fallback.',
    plan: 'Trigger → action → fallback',
    steps: ['Detect trigger', 'Run action', 'Log result', 'Flag failure'],
  },
  chat: {
    label: 'Frontier chat',
    eyebrow: 'Thinking work',
    headline: 'Keep it in ChatGPT or Claude.',
    body: 'Writing, research, planning, and strategy usually need a better prompt habit — not a new app, agent, or dashboard.',
    user: 'Writing, planning, and research.',
    agent: 'Use frontier chat first. No new system needed yet. Save the pattern and reuse it.',
    plan: 'Prompt habit, not software',
    steps: ['Clarify goal', 'Draft prompt', 'Save pattern', 'Reuse when needed'],
  },
}

const order: RouteKey[] = ['operator', 'guided', 'handoff', 'chat']

function App() {
  const [active, setActive] = useState<RouteKey>('operator')
  const [tick, setTick] = useState(0)
  const route = useMemo(() => routes[active], [active])

  useEffect(() => {
    document.title = 'Stay Automatic — AI setup, through chat'
  }, [])

  const choose = (key: RouteKey) => {
    setActive(key)
    setTick((value) => value + 1)
  }

  return (
    <main className="page-shell">
      <header className="topbar">
        <a className="brand" href="/"><span>Stay</span> Automatic</a>
        <a className="access" href="mailto:kyle@stayautomatic.com?subject=Stay%20Automatic%20workflow%20map">Request access</a>
      </header>

      <section className="hero-stage" aria-label="Stay Automatic workflow demo">
        <div className="copy-panel">
          <p className="kicker">AI setup, without another dashboard</p>
          <h1>Your first AI workflow should feel this obvious.</h1>
          <p className="lede">
            Pick the work. The phone shows the actual chat path: what the operator asks, what it recommends, and where it stops for human approval.
          </p>
          <div className="cta-row">
            <a className="button primary" href="mailto:kyle@stayautomatic.com?subject=Map%20my%20first%20AI%20workflow">Map my first workflow</a>
            <a className="button secondary" href="mailto:kyle@stayautomatic.com?subject=Preview%20the%20Stay%20Automatic%20workflow%20library">Preview workflow library</a>
          </div>
        </div>

        <figure className="device-stage" aria-label="Live phone chat workflow demo">
          <div className="ambient-shadow" />
          <div className="phone-rig">
            <div className="phone-edge" />
            <div className="phone-body">
              <div className="side-button side-one" />
              <div className="side-button side-two" />
              <div className="screen-glass">
                <div className="statusbar"><span>9:41</span><i /></div>
                <div className="dynamic-island" />
                <div className="chat-header">
                  <button aria-label="Back">‹</button>
                  <div><strong>Stay Automatic</strong><small>setup agent online</small></div>
                  <button aria-label="More">•••</button>
                </div>
                <div className="chat-wall" key={`${active}-${tick}`}>
                  <p className="bubble agent">What kind of work should your AI operator handle first?</p>
                  <p className="bubble user">{route.user}</p>
                  <p className="bubble agent">{route.agent}</p>
                  <div className="plan-card">
                    <span>Recommended path</span>
                    <strong>{route.plan}</strong>
                    <ul>
                      {route.steps.slice(0, 3).map((step) => <li key={step}>{step}</li>)}
                    </ul>
                  </div>
                </div>
                <div className="composer"><span>Message Stay Automatic…</span><button aria-label="Send">↑</button></div>
              </div>
            </div>
          </div>
        </figure>

        <aside className="control-panel" aria-live="polite">
          <div className="route-copy" key={active}>
            <p>{route.eyebrow}</p>
            <h2>{route.headline}</h2>
            <span>{route.body}</span>
          </div>

          <div className="route-buttons" aria-label="Choose workflow demo">
            {order.map((key) => (
              <button key={key} className={active === key ? 'active' : ''} onClick={() => choose(key)}>
                <span>{routes[key].label}</span>
                <small>{routes[key].eyebrow}</small>
              </button>
            ))}
          </div>
        </aside>
      </section>
    </main>
  )
}

export default App
