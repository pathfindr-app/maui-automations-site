import { useEffect, useMemo, useState } from 'react'

type RouteKey = 'operator' | 'approval' | 'handoff' | 'chat'
type Route = {
  label: string
  short: string
  user: string
  response: string
  plan: string
  proof: string[]
}

const routes: Record<RouteKey, Route> = {
  operator: {
    label: 'Inbox + follow-up',
    short: 'Cloud operator',
    user: 'My inbox, files, reports, and follow-up keep leaking time.',
    response: 'That is operator-ready. I would run this on a small cloud computer with inbox access, files, scheduled checks, and human approval before anything goes out.',
    plan: 'Build an owned operator lane',
    proof: ['Watch the inbox', 'Prepare files', 'Draft the report', 'Ask before send'],
  },
  approval: {
    label: 'Customer replies',
    short: 'Approval gate',
    user: 'I need help with customer replies, but I cannot let it send blindly.',
    response: 'Good. The automation should stop at approval. I’ll gather context, draft the response, show the risk points, and wait for your send.',
    plan: 'Put review before send',
    proof: ['Read thread', 'Draft reply', 'Flag risk', 'Wait for approval'],
  },
  handoff: {
    label: 'One app handoff',
    short: 'Simple automation',
    user: 'One app just needs to hand the same thing to another app.',
    response: 'Do not overbuild this. It is a rule, not an operator. Map the trigger, action, log, and failure path.',
    plan: 'Use a clean automation',
    proof: ['Trigger', 'Action', 'Log result', 'Fallback'],
  },
  chat: {
    label: 'Writing + planning',
    short: 'Frontier chat',
    user: 'Most of it is writing, planning, and research.',
    response: 'Keep this in ChatGPT or Claude for now. You need a reusable prompt habit, not another tool.',
    plan: 'Stay in frontier chat',
    proof: ['Clarify goal', 'Save prompt', 'Reuse pattern', 'Skip setup'],
  },
}

const routeOrder: RouteKey[] = ['operator', 'approval', 'handoff', 'chat']

function App() {
  const [selected, setSelected] = useState<RouteKey>('operator')
  const [shown, setShown] = useState<RouteKey>('operator')
  const [typing, setTyping] = useState(false)
  const selectedRoute = useMemo(() => routes[selected], [selected])
  const shownRoute = useMemo(() => routes[shown], [shown])

  useEffect(() => {
    document.title = 'Stay Automatic — AI setup, through chat'
  }, [])

  function choose(key: RouteKey) {
    if (key === selected) return
    setSelected(key)
    setTyping(true)
    window.setTimeout(() => {
      setShown(key)
      setTyping(false)
    }, 520)
  }

  return (
    <main className="page-shell">
      <header className="topbar">
        <a className="brand" href="/"><span>Stay</span> Automatic</a>
        <a className="access" href="mailto:kyle@stayautomatic.com?subject=Map%20my%20first%20AI%20workflow">Request access</a>
      </header>

      <section className="hero" aria-label="Stay Automatic live AI operator demo">
        <div className="copy">
          <p className="kicker">AI setup, without another dashboard</p>
          <h1>Show the work. See the setup.</h1>
          <p className="lede">
            A short chat turns one messy workflow into a clear path: use frontier chat, a simple automation, or an owned operator on a cloud computer.
          </p>
          <div className="cta-row">
            <a className="button primary" href="mailto:kyle@stayautomatic.com?subject=Map%20my%20first%20AI%20workflow">Map my first workflow</a>
            <a className="button ghost" href="mailto:kyle@stayautomatic.com?subject=Preview%20Stay%20Automatic%20workflow%20library">Preview library</a>
          </div>
        </div>

        <section className="demo-stage" aria-label="Live phone chat demo">
          <div className="stage-glow" />
          <div className="phone" aria-label="Phone chat interface">
            <div className="metal left" />
            <div className="metal right" />
            <div className="bezel">
              <div className="screen">
                <div className="island" />
                <div className="status"><span>9:41</span><span>◐ 5G ▰</span></div>
                <div className="chat-head">
                  <button aria-label="Back">‹</button>
                  <div><strong>Stay Automatic</strong><small>setup agent online</small></div>
                  <button aria-label="More">···</button>
                </div>

                <div className="conversation" key={`${selected}-${shown}-${typing ? 'typing' : 'done'}`}>
                  <p className="bubble agent intro">What kind of work should your AI operator handle first?</p>
                  <p className="bubble user">{selectedRoute.user}</p>
                  {typing ? (
                    <div className="typing" aria-label="Agent is typing"><i /><i /><i /></div>
                  ) : (
                    <>
                      <p className="bubble agent">{shownRoute.response}</p>
                      <div className="result-card">
                        <span>Recommended path</span>
                        <strong>{shownRoute.plan}</strong>
                        <div className="mini-steps">
                          {shownRoute.proof.map((step) => <em key={step}>{step}</em>)}
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <div className="composer"><span>Message Stay Automatic…</span><button aria-label="Send">↑</button></div>
              </div>
            </div>
          </div>

        </section>

        <aside className="explain" aria-live="polite">
          <p className="label">Current read</p>
          <h2>{typing ? 'Reading the workflow…' : shownRoute.plan}</h2>
          <p>{typing ? 'The agent is checking whether this deserves chat, automation, or an owned operator.' : shownRoute.response}</p>
          <div className="workflow-controls" aria-label="Choose workflow demo">
            {routeOrder.map((key) => (
              <button key={key} className={selected === key ? 'active' : ''} onClick={() => choose(key)}>
                <span>{routes[key].label}</span>
                <small>{routes[key].short}</small>
              </button>
            ))}
          </div>
        </aside>
      </section>
    </main>
  )
}

export default App
