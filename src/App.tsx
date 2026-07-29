import { useEffect, useMemo, useState } from 'react'

const assetPath = (path: string) => `${import.meta.env.BASE_URL}${path}`

type RouteKey = 'chat' | 'handoff' | 'operator' | 'guided'

const routes: Record<RouteKey, { label: string; headline: string; body: string }> = {
  chat: {
    label: 'Frontier chat',
    headline: 'Use ChatGPT or Claude first.',
    body: 'If the work is mostly thinking, writing, research, or planning, the right answer is probably not another system. Start in chat and keep it light.',
  },
  handoff: {
    label: 'Simple handoff',
    headline: 'Use a clean automation.',
    body: 'If it is one predictable transfer between two apps, a rule-based automation is better than pretending you need an agent.',
  },
  operator: {
    label: 'Owned operator',
    headline: 'Give the assistant a computer.',
    body: 'When the work touches inboxes, files, browser steps, reports, and approval gates, a Hermes operator on a cloud computer starts to make sense.',
  },
  guided: {
    label: 'Guided setup',
    headline: 'Design the approval gate first.',
    body: 'Customer replies, money, public claims, or sensitive data need a human-reviewed path before anything gets automated.',
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
          <h1>Figure out your AI setup in a chat.</h1>
          <p className="lede">
            Stay Automatic starts with a short conversation about your work, your tools, and what needs approval. Then it points you toward the simplest believable setup: frontier chat, a clean automation, your own Hermes operator, or guided help.
          </p>

          <div className="actions" aria-label="Primary actions">
            <a className="button primary" href="mailto:kyle@stayautomatic.com?subject=I%20want%20my%20AI%20setup%20map">Get my setup map</a>
            <a className="button ghost" href="mailto:kyle@stayautomatic.com?subject=Show%20me%20the%20workflow%20library">See workflow library</a>
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
              <button key={prompt.label} className={selectedPrompt === prompt.label ? 'selected' : ''} onClick={() => { setActive(prompt.key); setSelectedPrompt(prompt.label) }}>
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
