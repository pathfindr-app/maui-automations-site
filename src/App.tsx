import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Html, MeshTransmissionMaterial, RoundedBox, Text } from '@react-three/drei'
import { Group } from 'three'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

const assetPath = (path: string) => `${import.meta.env.BASE_URL}${path}`

gsap.registerPlugin(ScrollTrigger)

type QuizKey = 'workload' | 'risk' | 'tools' | 'comfort'
type QuizAnswers = Record<QuizKey, string>

const quizQuestions: Array<{
  key: QuizKey
  label: string
  prompt: string
  options: Array<{ value: string; label: string; note: string }>
}> = [
  {
    key: 'workload',
    label: '01 / repeated work',
    prompt: 'Where does your week keep leaking time?',
    options: [
      { value: 'chat', label: 'Thinking and writing', note: 'drafts, research, summaries, planning' },
      { value: 'automation', label: 'One fixed handoff', note: 'form → sheet, lead → email, reminder → calendar' },
      { value: 'operator', label: 'Messy work across apps', note: 'email, files, browser, docs, approvals, follow-up' },
      { value: 'unclear', label: 'It is mostly in my head', note: 'the process changes depending on the day' },
    ],
  },
  {
    key: 'tools',
    label: '02 / tools touched',
    prompt: 'What does the work need access to?',
    options: [
      { value: 'chat', label: 'Just my words and files', note: 'good candidate for frontier chat first' },
      { value: 'automation', label: 'Two predictable apps', note: 'simple automation may be enough' },
      { value: 'operator', label: 'Inbox, calendar, browser, Drive, sheets, code, or local files', note: 'this is where a real operator starts making sense' },
      { value: 'setup', label: 'Accounts I would rather not wire alone', note: 'guided setup is safer than blind DIY' },
    ],
  },
  {
    key: 'risk',
    label: '03 / judgment gate',
    prompt: 'What happens if the AI gets it wrong?',
    options: [
      { value: 'chat', label: 'Minor annoyance', note: 'rewrite it and move on' },
      { value: 'automation', label: 'Internal cleanup only', note: 'low-risk routing or organization' },
      { value: 'operator', label: 'Customer-facing but reviewable', note: 'draft first, human approves' },
      { value: 'setup', label: 'Money, legal, public claims, or sensitive customers', note: 'do not automate without gates' },
    ],
  },
  {
    key: 'comfort',
    label: '04 / setup style',
    prompt: 'How should the operator come online?',
    options: [
      { value: 'chat', label: 'I want the easiest possible start', note: 'use ChatGPT or Claude first' },
      { value: 'operator', label: 'I can follow careful copy/paste steps', note: 'DIY guide + community is enough' },
      { value: 'setup', label: 'I want someone there while accounts connect', note: 'done-with-you setup call' },
      { value: 'unclear', label: 'I need the map before the tools', note: 'start with workflow triage' },
    ],
  },
]

const resultCopy = {
  chat: {
    title: 'Start with frontier chat.',
    badge: 'Prompt-first',
    body: 'You probably do not need a full operator yet. Use ChatGPT, Claude, or Gemini for thinking, drafting, comparing, and planning. Buy the operator guide when the work starts needing tools, files, schedules, or approvals.',
  },
  automation: {
    title: 'Use a simple automation.',
    badge: 'Fixed handoff',
    body: 'If the workflow is predictable and only touches a couple apps, Zapier, Make, or n8n can be cleaner than an agent. Stay Automatic still helps you decide what should stay simple before you overbuild it.',
  },
  operator: {
    title: 'You are operator-ready.',
    badge: 'Hermes fit',
    body: 'Your work crosses tools and needs a place to live. A Hermes-style operator on a cloud computer can use frontier models, inspect files, run workflows, ask for approval, and keep reusable skills under your control.',
  },
  setup: {
    title: 'Bring a human to setup.',
    badge: 'Guided build',
    body: 'This touches accounts, customers, money, public claims, or sensitive systems. The right move is an operator with approval gates — not blind automation. Start with a guided setup or triage session.',
  },
  unclear: {
    title: 'Map the work first.',
    badge: 'Not ready yet',
    body: 'AI will not fix a workflow that only exists in someone’s head. Write down the handoff, the tools, the failure points, and the approval rules. Then decide whether it belongs in chat, automation, or an operator.',
  },
}

const workflowCards = [
  { title: 'Roofing report desk', tag: 'field photos → branded PDF', body: 'Job context, inspection photos, visible-condition notes, and correction loops become a customer-ready report with a human approval gate.' },
  { title: 'Snorkel photo delivery', tag: 'Telegram → folders → Dropbox', body: 'A sales note creates edit folders, preserves customer details, prepares delivery, and marks fulfillment without repetitive admin.' },
  { title: 'Food-truck promo lane', tag: 'one photo → draft → approval', body: 'Food photos, daily offers, review replies, and repeat-customer nudges move through a simple queue instead of five apps.' },
  { title: 'Claim admin operator', tag: 'email → Drive → sheet → summary', body: 'Incoming messages and documents get matched, summarized, routed, and escalated when confidence is low.' },
]

const skillTiles = [
  'Gmail triage', 'Calendar prep', 'Drive search', 'Photo packet fulfillment', 'Proposal draft', 'Review reply', 'Lead research', 'PDF report QA', 'Weekly owner digest', 'Website fix runner', 'Customer follow-up', 'Do-not-automate checklist'
]

function useSiteMotion() {
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const lenis = reduce ? null : new Lenis({ lerp: 0.075, smoothWheel: true })
    let rafId = 0

    const raf = (time: number) => {
      lenis?.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    if (lenis) rafId = requestAnimationFrame(raf)

    const ctx = gsap.context(() => {
      if (reduce) return
      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
        gsap.fromTo(el, { y: 28 }, {
          y: 0,
          duration: 0.78,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 84%' },
        })
      })
      gsap.utils.toArray<HTMLElement>('[data-pin-card]').forEach((el) => {
        gsap.to(el, {
          yPercent: -8,
          ease: 'none',
          scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 1.2 },
        })
      })
    })

    return () => {
      ctx.revert()
      lenis?.destroy()
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [])
}

function OperatorCore() {
  const group = useRef<Group>(null)
  const ring = useRef<Group>(null)

  useFrame((state, delta) => {
    if (!group.current || !ring.current) return
    const t = state.clock.elapsedTime
    group.current.rotation.y = Math.sin(t * 0.22) * 0.18
    group.current.rotation.x = Math.sin(t * 0.17) * 0.06
    ring.current.rotation.y += delta * 0.22
    ring.current.rotation.z -= delta * 0.12
  })

  return (
    <group ref={group}>
      <Float speed={1.1} rotationIntensity={0.18} floatIntensity={0.34}>
        <RoundedBox args={[2.55, 1.55, 1.05]} radius={0.16} smoothness={8}>
          <meshStandardMaterial color="#141512" roughness={0.42} metalness={0.18} />
        </RoundedBox>
        <RoundedBox args={[2.25, 1.18, 1.08]} radius={0.1} smoothness={7} position={[0, 0.02, 0.04]}>
          <MeshTransmissionMaterial color="#d7f8e7" thickness={0.28} roughness={0.24} transmission={0.72} chromaticAberration={0.04} anisotropy={0.2} />
        </RoundedBox>
        <Text position={[0, 0.17, 0.64]} fontSize={0.16} letterSpacing={0.08} color="#0d241b" anchorX="center" anchorY="middle">
          HERMES OPERATOR
        </Text>
        <Text position={[0, -0.08, 0.65]} fontSize={0.105} letterSpacing={0.04} color="#214738" anchorX="center" anchorY="middle">
          cloud computer / tools / approvals
        </Text>
      </Float>
      <group ref={ring}>
        {['OpenAI', 'Claude', 'Gemini', 'Local'].map((label, index) => {
          const angle = (index / 4) * Math.PI * 2 + 0.42
          return (
            <group key={label} position={[Math.cos(angle) * 1.72, Math.sin(angle) * 0.34, Math.sin(angle) * 0.98]}>
              <mesh>
                <sphereGeometry args={[0.1, 32, 32]} />
                <meshStandardMaterial color={index % 2 ? '#d7b66d' : '#91c7ae'} emissive={index % 2 ? '#6b3f10' : '#123d2e'} emissiveIntensity={0.28} />
              </mesh>
              <Html center distanceFactor={9} className="model-chip-3d">{label}</Html>
            </group>
          )
        })}
      </group>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -0.82, 0]}>
        <torusGeometry args={[1.85, 0.006, 8, 160]} />
        <meshBasicMaterial color="#b89555" transparent opacity={0.48} />
      </mesh>
      <mesh rotation={[Math.PI / 2.35, 0.2, 0.1]} position={[0, -0.04, 0]}>
        <torusGeometry args={[2.22, 0.004, 8, 180]} />
        <meshBasicMaterial color="#dfe9da" transparent opacity={0.24} />
      </mesh>
    </group>
  )
}

function OperatorScene() {
  return (
    <div className="operator-canvas" aria-label="3D cloud computer operator model">
      <Canvas camera={{ position: [0, 0.25, 5.2], fov: 42 }} dpr={[1, 1.5]} gl={{ antialias: true, alpha: true }}>
        <ambientLight intensity={1.6} />
        <directionalLight position={[3, 4, 4]} intensity={2.4} />
        <pointLight position={[-3, -1, 2]} color="#8bbda9" intensity={1.8} />
        <Suspense fallback={null}>
          <OperatorCore />
        </Suspense>
      </Canvas>
      <div className="canvas-grid" />
    </div>
  )
}

function OperatorQuiz() {
  const [answers, setAnswers] = useState<Partial<QuizAnswers>>({ workload: 'operator' })
  const [activeKey, setActiveKey] = useState<QuizKey>('workload')

  const resultKey = useMemo(() => {
    const counts: Record<string, number> = { chat: 0, automation: 0, operator: 0, setup: 0, unclear: 0 }
    Object.values(answers).forEach((value) => { if (value) counts[value] += 1 })
    if (counts.setup) return 'setup'
    return (Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'operator') as keyof typeof resultCopy
  }, [answers])

  const result = resultCopy[resultKey]

  return (
    <section className="quiz-panel" id="quiz" data-reveal>
      <div className="quiz-header">
        <p className="section-index">AI Operator Fit Check</p>
        <h2>Before you buy another AI tool, find out what should actually run the work.</h2>
        <p>The result is intentionally opinionated: frontier chat when that is enough, simple automation when that is cleaner, and your own operator when the work needs tools, memory, files, schedules, and approvals.</p>
      </div>
      <div className="quiz-workbench">
        <div className="question-stack" role="tablist" aria-label="Quiz questions">
          {quizQuestions.map((question) => (
            <button key={question.key} className={`question-tab${activeKey === question.key ? ' is-active' : ''}`} type="button" onClick={() => setActiveKey(question.key)}>
              <span>{question.label}</span>
              <strong>{answers[question.key] ? resultCopy[answers[question.key] as keyof typeof resultCopy].badge : 'open'}</strong>
            </button>
          ))}
        </div>
        <div className="question-card">
          {quizQuestions.filter((q) => q.key === activeKey).map((question) => (
            <div key={question.key}>
              <span className="question-label">{question.label}</span>
              <h3>{question.prompt}</h3>
              <div className="option-grid">
                {question.options.map((option) => (
                  <button key={option.value} type="button" className={`option-card${answers[question.key] === option.value ? ' selected' : ''}`} onClick={() => {
                    setAnswers((current) => ({ ...current, [question.key]: option.value }))
                    const index = quizQuestions.findIndex((q) => q.key === question.key)
                    const next = quizQuestions[index + 1]
                    if (next) setActiveKey(next.key)
                  }}>
                    <strong>{option.label}</strong>
                    <span>{option.note}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
        <aside className="quiz-result" aria-live="polite">
          <span>{result.badge}</span>
          <h3>{result.title}</h3>
          <p>{result.body}</p>
          <a href="mailto:kyle@stayautomatic.com?subject=AI%20Operator%20Fit%20Check">Send me this result</a>
        </aside>
      </div>
    </section>
  )
}

function HomePage() {
  useSiteMotion()

  return (
    <main className="page-shell">
      <header className="nav-bar">
        <a className="brand-mark" href={assetPath('./')} aria-label="Stay Automatic home"><span>Stay</span>Automatic</a>
        <nav>
          <a href="#quiz">Fit check</a>
          <a href="#operator">Operator</a>
          <a href="#library">Library</a>
          <a href="mailto:kyle@stayautomatic.com">Contact</a>
        </nav>
      </header>

      <section className="hero-section">
        <div className="hero-copy" data-reveal>
          <p className="eyebrow">Stay Automatic / AI operator setup</p>
          <h1>Your own AI operator, not another rented dashboard.</h1>
          <p className="hero-lede">Set up a cloud computer that works through plain English, connects to your tools, and uses frontier models without trapping your workflow inside one more SaaS wrapper.</p>
          <div className="hero-actions">
            <a className="primary-link" href="#quiz">Take the fit check</a>
            <a className="secondary-link" href="#operator">See what you own</a>
          </div>
          <div className="proof-row" aria-label="Proof points">
            <span>Hermes cloud / VPS</span>
            <span>Skill library</span>
            <span>Human approvals</span>
          </div>
        </div>
        <div className="hero-visual-wrap" data-pin-card>
          <OperatorScene />
          <div className="operator-caption">
            <span>Chat is the interface.</span>
            <strong>The computer is the worker.</strong>
          </div>
        </div>
      </section>

      <section className="ticker" aria-label="Positioning ticker">
        <div>
          <span>Stop stacking wrappers.</span>
          <span>Use the frontier models.</span>
          <span>Keep the workbench.</span>
          <span>Skills compound.</span>
          <span>Approvals stay human.</span>
          <span>Stop stacking wrappers.</span>
        </div>
      </section>

      <OperatorQuiz />

      <section className="split-section" id="operator">
        <div className="section-copy" data-reveal>
          <p className="section-index">What you actually get</p>
          <h2>A small cloud computer with an agent living on it.</h2>
          <p>Frontier models are the engines. The operator is the place where your instructions, files, tools, schedules, credentials, skills, and review gates come together. That is the part worth owning.</p>
        </div>
        <div className="ownership-grid" data-reveal>
          {[
            ['01', 'A place to live', 'Hermes can run from cloud, VPS, desktop, or messaging — not only inside one model company’s chat window.'],
            ['02', 'Swappable engines', 'Use OpenAI, Claude, Gemini, local models, or the next frontier model without rebuilding your habits from scratch.'],
            ['03', 'Inspectable work', 'Skills, notes, scripts, files, prompts, outputs, and logs remain visible instead of disappearing into a proprietary workflow builder.'],
            ['04', 'Human gates', 'Customer messages, public posts, money, legal-ish work, estimates, and sensitive decisions pause for approval.'],
          ].map(([num, title, body]) => (
            <article className="ownership-card" key={title}>
              <span>{num}</span>
              <h3>{title}</h3>
              <p>{body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="manifesto-section">
        <div className="manifesto-card" data-reveal>
          <p className="section-index">Anti-wrapper doctrine</p>
          <h2>The next AI subscription probably is not the answer.</h2>
          <p>Most SaaS wrappers are trying to turn the same frontier models into another dashboard, another seat, another credit meter, another place where your workflow gets trapped. Sometimes they are useful. Often, they are just more app-switching with better copy.</p>
          <p className="pull-line">Use hosted tools where they make sense. Keep an operator where the work matters.</p>
        </div>
      </section>

      <section className="workflow-section" id="library">
        <div className="section-heading" data-reveal>
          <p className="section-index">Community / workflow repo</p>
          <h2>The product is not just a PDF. It is a growing library of small-business operators.</h2>
          <p>Buyers get the guide, setup path, workflow ideas, skill templates, and community support around what actually works for real operators.</p>
        </div>
        <div className="workflow-grid">
          {workflowCards.map((card) => (
            <article className="workflow-card" key={card.title} data-reveal>
              <span>{card.tag}</span>
              <h3>{card.title}</h3>
              <p>{card.body}</p>
            </article>
          ))}
        </div>
        <div className="skill-cloud" aria-label="Example skill library">
          {skillTiles.map((tile) => <span key={tile}>{tile}</span>)}
        </div>
      </section>

      <section className="offer-section" data-reveal>
        <div>
          <p className="section-index">Offer ladder</p>
          <h2>Start free. Own the setup. Get help when it gets real.</h2>
        </div>
        <div className="offer-ladder">
          {[
            ['Free', 'AI Operator Fit Check', 'A useful diagnosis before buying another AI tool.'],
            ['$47–$97', 'Operator field guide', 'Cloud/Hermes setup path, templates, workflow maps, and first-run playbooks.'],
            ['$197+', 'Workflow triage', 'A human-reviewed map of what to automate, what to leave alone, and where approvals belong.'],
            ['$1.5k+', 'Setup sprint', 'A narrow operator build connected to real tools and verified before handoff.'],
          ].map(([price, title, body]) => (
            <article className="offer-card" key={title}>
              <span>{price}</span>
              <h3>{title}</h3>
              <p>{body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="final-cta" id="start">
        <div data-reveal>
          <p className="section-index">Start here</p>
          <h2>Bring one annoying workflow. We will decide what deserves an operator.</h2>
          <p>No fake autopilot. No twenty-tool stack. One working path from normal request to finished work, with the human still in charge.</p>
          <div className="hero-actions">
            <a className="primary-link" href="#quiz">Take the fit check</a>
            <a className="secondary-link" href="mailto:kyle@stayautomatic.com">kyle@stayautomatic.com</a>
          </div>
        </div>
      </section>
    </main>
  )
}

function App() {
  document.title = 'Stay Automatic — Your Own AI Operator'
  return <HomePage />
}

export default App
