import { useEffect, useMemo, useState } from 'react'

const assetPath = (path: string) => `${import.meta.env.BASE_URL}${path}`

type RouteKey = 'chat' | 'operator' | 'guided' | 'handoff'
type Route = {
  label: string
  eyebrow: string
  headline: string
  body: string
  image: string
  steps: string[]
}

const routes: Record<RouteKey, Route> = {
  operator: {
    label: 'Cloud operator',
    eyebrow: 'Best for messy recurring work',
    headline: 'The assistant gets a computer.',
    body: 'Inbox, files, browser steps, reports, reminders, and approval gates belong on an owned operator — not trapped in another rented dashboard.',
    image: 'generated/stay-automatic-phone-operator.png',
    steps: ['Watch inbox', 'Draft follow-up', 'Attach files', 'Ask before send'],
  },
  guided: {
    label: 'Approval gate',
    eyebrow: 'Best for customer replies',
    headline: 'Human review stays in the loop.',
    body: 'The operator prepares the reply and context, then stops at the line where a person should make the call.',
    image: 'generated/stay-automatic-phone-customer.png',
    steps: ['Read customer thread', 'Prepare context', 'Draft reply', 'Wait for approval'],
  },
  handoff: {
    label: 'Clean automation',
    eyebrow: 'Best for predictable handoffs',
    headline: 'Do not over-agent a simple rule.',
    body: 'If the workflow is one trigger and one action, Stay Automatic maps the clean automation and the fallback instead of adding complexity.',
    image: 'generated/stay-automatic-phone-handoff.png',
    steps: ['Detect trigger', 'Run action', 'Log result', 'Flag failure'],
  },
  chat: {
    label: 'Frontier chat',
    eyebrow: 'Best for thinking work',
    headline: 'Keep it in ChatGPT or Claude.',
    body: 'Writing, research, planning, and strategy usually need a better prompt habit — not a new app, agent, or dashboard.',
    image: 'generated/stay-automatic-phone-chat.png',
    steps: ['Clarify goal', 'Draft prompt', 'Save pattern', 'Re-use when needed'],
  },
}

const order: RouteKey[] = ['operator', 'guided', 'handoff', 'chat']

function App() {
  const [active, setActive] = useState<RouteKey>('operator')
  const [pulse, setPulse] = useState(0)
  const route = useMemo(() => routes[active], [active])

  useEffect(() => {
    document.title = 'Stay Automatic — AI setup, through chat'
  }, [])

  const choose = (key: RouteKey) => {
    setActive(key)
    setPulse((value) => value + 1)
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
            Pick the work. The demo shows what the operator would do on the phone: chat, route, draft, prepare, and stop for approval when it matters.
          </p>
          <div className="cta-row">
            <a className="button primary" href="mailto:kyle@stayautomatic.com?subject=Map%20my%20first%20AI%20workflow">Map my first workflow</a>
            <a className="button secondary" href="mailto:kyle@stayautomatic.com?subject=Preview%20the%20Stay%20Automatic%20workflow%20library">Preview workflow library</a>
          </div>
        </div>

        <figure className="product-render" aria-label="Live phone workflow demo">
          <div className="render-backdrop" />
          <img key={route.image} className="phone-image" src={assetPath(route.image)} alt={`${route.label} phone chat demo`} />
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

          <div className="workflow-card" key={`${active}-${pulse}`}>
            <p>Demo sequence</p>
            {route.steps.map((step, index) => (
              <div className="step" style={{ '--delay': `${index * 90}ms` } as React.CSSProperties} key={step}>
                <i />
                <span>{step}</span>
              </div>
            ))}
          </div>
        </aside>
      </section>
    </main>
  )
}

export default App
