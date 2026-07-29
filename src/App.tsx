import { useEffect, useMemo, useState } from 'react'

type PathKey = 'chat' | 'automation' | 'operator' | 'guided'
type Question = {
  kicker: string
  prompt: string
  options: Array<{ label: string; path: PathKey; reply: string }>
}

const questions: Question[] = [
  {
    kicker: 'AI Operator Fit Check / 01',
    prompt: 'What kind of work keeps repeating in your week?',
    options: [
      { label: 'Writing, research, planning', path: 'chat', reply: 'Mostly thinking work.' },
      { label: 'One clean handoff between apps', path: 'automation', reply: 'A predictable app handoff.' },
      { label: 'Messy work across email, files, browser, and follow-up', path: 'operator', reply: 'Cross-app work that needs a worker.' },
      { label: 'Sensitive customer or money-related work', path: 'guided', reply: 'High-stakes work with approvals.' },
    ],
  },
  {
    kicker: 'AI Operator Fit Check / 02',
    prompt: 'Where should this assistant live?',
    options: [
      { label: 'Inside ChatGPT or Claude is fine', path: 'chat', reply: 'A chat window is enough for now.' },
      { label: 'Inside a simple automation tool', path: 'automation', reply: 'A rule-based flow is enough.' },
      { label: 'On a small cloud computer I control', path: 'operator', reply: 'A cloud operator makes sense.' },
      { label: 'Set it up with someone watching the gates', path: 'guided', reply: 'Guided setup is safer.' },
    ],
  },
  {
    kicker: 'AI Operator Fit Check / 03',
    prompt: 'What should happen before anything customer-facing goes out?',
    options: [
      { label: 'I just want better drafts', path: 'chat', reply: 'Drafts only.' },
      { label: 'Auto-route low-risk internal work', path: 'automation', reply: 'Internal routing.' },
      { label: 'Prepare the work, then ask me to approve', path: 'operator', reply: 'Draft, prepare, ask approval.' },
      { label: 'Nothing sends without a human review gate', path: 'guided', reply: 'Strict approval gate.' },
    ],
  },
]

const results: Record<PathKey, { label: string; title: string; body: string }> = {
  chat: {
    label: 'Result / frontier chat',
    title: 'Start in chat. Do not overbuild yet.',
    body: 'ChatGPT, Claude, or Gemini is probably enough until the work needs tools, schedules, files, or approvals.',
  },
  automation: {
    label: 'Result / simple automation',
    title: 'Use a clean handoff, not an agent.',
    body: 'If it is one predictable transfer between apps, keep it simple. Zapier, Make, or n8n may be the right answer.',
  },
  operator: {
    label: 'Result / operator-ready',
    title: 'Put an operator on a computer you control.',
    body: 'This is where Hermes makes sense: chat as the interface, a cloud computer as the worker, frontier models as swappable engines.',
  },
  guided: {
    label: 'Result / guided setup',
    title: 'Build the gate before the automation.',
    body: 'Customer-facing, money, legal-ish, or public work needs a human approval path. Start with a guided operator setup.',
  },
}

const panels = [
  {
    eyebrow: '01 / the interface',
    title: 'The quiz happens where the operator will live.',
    body: 'No funnel maze. A clean chat asks the right questions, explains the tradeoffs, and recommends chat, automation, an owned operator, or guided setup.',
  },
  {
    eyebrow: '02 / the worker',
    title: 'Chat is not the product. The computer behind it is.',
    body: 'Hermes gives the assistant a place to use tools, read files, run skills, remember preferences, and pause for approval.',
  },
  {
    eyebrow: '03 / the library',
    title: 'The guide becomes a living workflow shelf.',
    body: 'Buyers get more than instructions: field-tested small-business skills, workflow recipes, examples, and a community around what actually works.',
  },
]

function App() {
  const [step, setStep] = useState(0)
  const [history, setHistory] = useState<Array<{ from: 'operator' | 'user'; text: string }>>([
    { from: 'operator', text: questions[0].prompt },
  ])
  const [scores, setScores] = useState<Record<PathKey, number>>({ chat: 0, automation: 0, operator: 1, guided: 0 })
  const [panelIndex, setPanelIndex] = useState(0)

  const resultKey = useMemo<PathKey>(() => {
    return (Object.entries(scores).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'operator') as PathKey
  }, [scores])

  const currentQuestion = questions[step]
  const finished = step >= questions.length
  const result = results[resultKey]
  const panel = panels[panelIndex]

  useEffect(() => {
    document.title = 'Stay Automatic — AI Operator Fit Check'
    const onWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaY) < 18) return
      setPanelIndex((current) => Math.max(0, Math.min(panels.length - 1, current + (event.deltaY > 0 ? 1 : -1))))
    }
    window.addEventListener('wheel', onWheel, { passive: true })
    return () => window.removeEventListener('wheel', onWheel)
  }, [])

  const choose = (option: Question['options'][number]) => {
    setHistory((items) => {
      const next = [...items, { from: 'user' as const, text: option.reply }]
      const upcoming = questions[step + 1]
      if (upcoming) next.push({ from: 'operator', text: upcoming.prompt })
      else next.push({ from: 'operator', text: results[option.path].title })
      return next.slice(-7)
    })
    setScores((current) => ({ ...current, [option.path]: current[option.path] + 1 }))
    setStep((current) => current + 1)
    setPanelIndex((current) => Math.min(panels.length - 1, current + 1))
  }

  const restart = () => {
    setStep(0)
    setScores({ chat: 0, automation: 0, operator: 1, guided: 0 })
    setHistory([{ from: 'operator', text: questions[0].prompt }])
    setPanelIndex(0)
  }

  return (
    <main className="stage-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

      <header className="topline">
        <a className="brand" href="/" aria-label="Stay Automatic"><span>Stay</span> Automatic</a>
        <nav aria-label="Single screen controls">
          {panels.map((item, index) => (
            <button key={item.eyebrow} className={panelIndex === index ? 'active' : ''} onClick={() => setPanelIndex(index)}>{String(index + 1).padStart(2, '0')}</button>
          ))}
          <a href="mailto:kyle@stayautomatic.com">Contact</a>
        </nav>
      </header>

      <section className="one-screen">
        <div className="editorial-copy">
          <p className="eyebrow">Stay Automatic / setup diagnostic</p>
          <h1>Meet your AI operator in chat.</h1>
          <p className="lede">A one-screen fit check that tells people whether they need frontier chat, a simple automation, an owned Hermes operator, or a guided setup call.</p>
          <div className="button-row">
            <a className="primary" href="mailto:kyle@stayautomatic.com?subject=AI%20Operator%20Fit%20Check">Join the field guide waitlist</a>
            <button className="secondary" onClick={restart}>Run the fit check</button>
          </div>
        </div>

        <section className="render-stage" aria-label="Premium chat interface product render">
          <div className="shadow-plate" />
          <div className="phone-rig">
            <div className="phone-edge" />
            <div className="phone-body">
              <div className="phone-glass">
                <div className="chat-app chrome-bar">
                  <div className="avatar">SA</div>
                  <div>
                    <strong>Stay Automatic</strong>
                    <span>AI Operator Fit Check</span>
                  </div>
                  <div className="status-dot" />
                </div>

                <div className="message-list">
                  {history.map((item, index) => (
                    <div key={`${item.text}-${index}`} className={`bubble ${item.from}`}>{item.text}</div>
                  ))}
                </div>

                <div className="choice-dock">
                  {!finished && currentQuestion ? (
                    <>
                      <p>{currentQuestion.kicker}</p>
                      <div className="choice-grid">
                        {currentQuestion.options.map((option) => (
                          <button key={option.label} onClick={() => choose(option)}>{option.label}</button>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="result-card">
                      <span>{result.label}</span>
                      <h2>{result.title}</h2>
                      <p>{result.body}</p>
                      <button onClick={restart}>Run it again</button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        <aside className="info-card" aria-live="polite">
          <p>{panel.eyebrow}</p>
          <h2>{panel.title}</h2>
          <span>{panel.body}</span>
          <div className="micro-list">
            <div><strong>Cloud computer</strong><small>Hermes / Portal / VPS</small></div>
            <div><strong>Frontier models</strong><small>OpenAI / Claude / Gemini</small></div>
            <div><strong>Human gates</strong><small>approve before send</small></div>
          </div>
        </aside>
      </section>
    </main>
  )
}

export default App
