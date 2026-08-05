import { type FocusEvent, type KeyboardEvent, useEffect, useMemo, useRef, useState } from 'react'
import { buildBlueprint, type Blueprint, type BlueprintInput } from './blueprint.mjs'

type Mode = 'home' | 'intake' | 'blueprint'
type AnswerKey = keyof BlueprintInput
type SpeechRecognitionLike = {
  continuous: boolean
  interimResults: boolean
  lang: string
  start: () => void
  stop: () => void
  onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null
  onend: (() => void) | null
  onerror: ((event: { error?: string }) => void) | null
}

type Question = {
  key: AnswerKey
  kicker: string
  title: string
  hint: string
  options?: string[]
  multiple?: boolean
  open?: boolean
}

const emptyAnswers: BlueprintInput = {
  business: '', teamSize: '', goal: '', workflow: '', tools: [], access: '', risk: '', channel: '', priority: '',
}

const questions: Question[] = [
  { key: 'business', kicker: 'Your business', title: 'What kind of operation is this?', hint: 'Choose the closest fit. We will personalize the details next.', options: ['Roofing / trades', 'Restaurant / hospitality', 'Tours / photo services', 'Professional services', 'Something else'] },
  { key: 'teamSize', kicker: 'The people', title: 'Who needs this to work?', hint: 'Team size changes the approval and access plan.', options: ['Just me', '2–10 people', '11–50 people', 'More than 50'] },
  { key: 'goal', kicker: 'The real bottleneck', title: 'Where does work get stuck?', hint: 'Type or talk naturally. Describe what repeats, waits, or gets dropped.', open: true },
  { key: 'workflow', kicker: 'First lane', title: 'Which job is closest?', hint: 'Pick one first. A smaller lane is easier to prove.', options: ['Inbound leads', 'Inbox and follow-up', 'Reports and claims', 'Social and content', 'Customer delivery', 'One fixed handoff'], multiple: true },
  { key: 'tools', kicker: 'Current stack', title: 'What does the work touch today?', hint: 'Select everything involved. No passwords or credentials.', options: ['Google Workspace', 'Microsoft 365', 'Google Sheets', 'Jobber / CRM', 'QuickBooks', 'Meta / Instagram', 'Dropbox', 'Forms / website'], multiple: true },
  { key: 'access', kicker: 'Access readiness', title: 'Who controls these accounts?', hint: 'We only need access status. Never enter credentials here.', options: ['I own or administer most accounts', 'A teammate or vendor must approve access', 'I am not sure yet'] },
  { key: 'risk', kicker: 'Human control', title: 'What consequence can this workflow create?', hint: 'This determines where approval must sit.', options: ['Internal preparation only', 'Customer communication with approval', 'External system action with approval', 'Money, insurance, legal, or regulated decisions'] },
  { key: 'channel', kicker: 'Daily interface', title: 'Where should your team use it?', hint: 'Start where people already pay attention.', options: ['Telegram or text-style chat', 'Email', 'Web dashboard', 'Scheduled background checks'] },
  { key: 'priority', kicker: 'Pilot target', title: 'What matters most in week one?', hint: 'Your answer sets the proof standard.', options: ['Reduce dropped work', 'Save owner attention', 'Respond faster', 'Create cleaner visibility', 'Easiest possible start'] },
]

function App() {
  const [mode, setMode] = useState<Mode>('home')
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<BlueprintInput>(emptyAnswers)
  const [blueprint, setBlueprint] = useState<Blueprint | null>(null)
  const [phoneFocused, setPhoneFocused] = useState(false)
  const [voiceState, setVoiceState] = useState<'idle' | 'listening' | 'unsupported' | 'error'>('idle')
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null)
  const phoneSceneRef = useRef<HTMLElement | null>(null)
  const activeQuestion = questions[step]
  const progress = mode === 'blueprint' ? 100 : Math.round(((step + 1) / questions.length) * 100)
  const contactEmail = 'kylericketts@protonmail.com'
  const contactPhone = '808.250.7337'

  useEffect(() => {
    if (mode === 'home') return
    localStorage.setItem('stayautomatic-blueprint-draft', JSON.stringify({ mode, step, answers }))
  }, [mode, step, answers])

  const emailHref = useMemo(() => {
    if (!blueprint) return `mailto:${contactEmail}`
    const subject = `My AI setup guide - ${answers.business || 'Business'}`
    const body = [
      `Business: ${answers.business}`,
      `Goal: ${answers.goal}`,
      `Recommended first lane: ${blueprint.recommendation.title}`,
      `Implementation class: ${blueprint.recommendation.kind}`,
      `Current tools: ${answers.tools.join(', ') || 'Not listed'}`,
      `Access status: ${answers.access}`,
      `Human approval: ${blueprint.boundary.humanApproval}`,
      '',
      'I would like help turning this guide into a working setup.',
    ].join('\n')
    return `mailto:${contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  }, [answers, blueprint])

  function canFocusPhone() {
    return window.matchMedia('(hover: hover) and (pointer: fine)').matches
  }

  function showPhoneFocus() {
    if (canFocusPhone() && mode !== 'home') setPhoneFocused(true)
  }

  function hidePhoneFocus() {
    setPhoneFocused(false)
  }

  function handlePhoneBlur(event: FocusEvent<HTMLElement>) {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
      hidePhoneFocus()
    }
  }

  function activatePhone() {
    setPhoneFocused(true)
    if (mode === 'home') {
      window.setTimeout(startBlueprint, 360)
    }
  }

  function handlePhoneKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.currentTarget !== event.target) return
    if (event.key !== 'Enter' && event.key !== ' ') return
    event.preventDefault()
    activatePhone()
  }

  function startBlueprint() {
    setMode('intake')
    setStep(0)
    setAnswers(emptyAnswers)
    setBlueprint(null)
    setVoiceState('idle')
    if (window.innerWidth <= 760) {
      window.setTimeout(() => phoneSceneRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 90)
    }
  }

  function updateAnswer(key: AnswerKey, value: string | string[]) {
    setAnswers((current) => ({ ...current, [key]: value }))
  }

  function chooseOption(value: string) {
    if (!activeQuestion) return
    const key = activeQuestion.key
    if (activeQuestion.multiple) {
      if (key === 'tools') {
        const selected = answers.tools.includes(value)
          ? answers.tools.filter((item) => item !== value)
          : [...answers.tools, value]
        updateAnswer('tools', selected)
      } else {
        updateAnswer(key, value)
      }
      return
    }
    const nextAnswers = { ...answers, [key]: value }
    setAnswers(nextAnswers)
    if (step === questions.length - 1) {
      completeBlueprint(nextAnswers)
    } else {
      window.setTimeout(() => setStep((current) => current + 1), 120)
    }
  }

  function canContinue() {
    if (!activeQuestion) return false
    const answer = answers[activeQuestion.key]
    return Array.isArray(answer) ? answer.length > 0 : Boolean(answer.trim())
  }

  function continueStep() {
    if (!canContinue()) return
    if (step === questions.length - 1) completeBlueprint(answers)
    else setStep((current) => current + 1)
  }

  function completeBlueprint(finalAnswers: BlueprintInput) {
    const result = buildBlueprint(finalAnswers)
    setAnswers(finalAnswers)
    setBlueprint(result)
    setMode('blueprint')
    localStorage.setItem('stayautomatic-blueprint', JSON.stringify({ answers: finalAnswers, blueprint: result }))
    if (window.innerWidth <= 760) {
      window.setTimeout(() => phoneSceneRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 90)
    }
  }

  function goBack() {
    if (step === 0) setMode('home')
    else setStep((current) => current - 1)
  }

  function startVoice() {
    const SpeechRecognition = (window as unknown as { SpeechRecognition?: new () => SpeechRecognitionLike; webkitSpeechRecognition?: new () => SpeechRecognitionLike }).SpeechRecognition
      ?? (window as unknown as { webkitSpeechRecognition?: new () => SpeechRecognitionLike }).webkitSpeechRecognition
    if (!SpeechRecognition) {
      setVoiceState('unsupported')
      return
    }
    const recognition = new SpeechRecognition()
    recognitionRef.current = recognition
    recognition.continuous = false
    recognition.interimResults = false
    recognition.lang = 'en-US'
    recognition.onresult = (event) => {
      const transcript = event.results[0]?.[0]?.transcript?.trim() ?? ''
      if (transcript) updateAnswer('goal', transcript)
      setVoiceState('idle')
    }
    recognition.onerror = () => setVoiceState('error')
    recognition.onend = () => setVoiceState((current) => current === 'listening' ? 'idle' : current)
    setVoiceState('listening')
    recognition.start()
  }

  function downloadManifest() {
    if (!blueprint) return
    const blob = new Blob([JSON.stringify(blueprint.manifest, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = 'stay-automatic-setup-guide.json'
    anchor.click()
    URL.revokeObjectURL(url)
  }

  const selectedValues = activeQuestion?.key === 'tools' ? answers.tools : [String(answers[activeQuestion?.key] ?? '')]

  return (
    <main className={`page-shell ${mode === 'home' ? '' : 'onboarding-mode'} ${mode === 'blueprint' ? 'result-mode' : ''} ${phoneFocused ? 'phone-focus' : ''}`}>
      <div className="phone-focus-backdrop" aria-hidden="true" />
      <header className="masthead" aria-label="Stay Automatic navigation">
        <a href="/" className="brand" aria-label="Stay Automatic home"><span>Stay</span> Automatic</a>
        <a href={`mailto:${contactEmail}`} className="access-link">{contactPhone}</a>
      </header>

      <section className="hero" aria-label="Build a custom AI setup guide">
        <div className="editorial-copy">
          <p className="overline">Custom AI setup guide</p>
          <h1>{mode === 'home' ? <>Learn to run <em>your own agents.</em></> : mode === 'blueprint' ? <>Your setup guide <em>is ready.</em></> : <>Map the work. <em>Build the agent.</em></>}</h1>
          <p className="lede">{mode === 'home'
            ? 'AI agents are becoming the new way work gets done. Use the phone to describe your business, your tools, and the work that slows you down. You will leave with a practical setup guide for what to install, what access to verify, what to build first, and how to keep improving it yourself.'
            : mode === 'blueprint'
              ? 'This is a starting architecture, not a generic AI score. Provider access and account requirements remain marked for verification before anything is connected.'
              : 'No AI vocabulary test. No passwords. Just your business, the work you want fixed, and the systems already involved.'}</p>
          {mode === 'home' ? (
            <div className="hero-actions">
              <button className="action primary" type="button" data-action="start-blueprint" onClick={startBlueprint}>Build my guide <span>→</span></button>
              <a className="action quiet" href={`mailto:${contactEmail}?subject=AI%20setup%20guide`}>Talk through it instead</a>
            </div>
          ) : (
            <div className="promise-list" aria-label="Blueprint contents">
              <span><b>01</b> What to install</span><span><b>02</b> Accounts and access</span><span><b>03</b> Skills to start with</span><span><b>04</b> How to keep it working</span>
            </div>
          )}
        </div>

        <figure
          ref={phoneSceneRef}
          className="phone-scene"
          aria-label="Interactive Stay Automatic onboarding inside a photoreal phone"
          onMouseEnter={showPhoneFocus}
          onMouseLeave={hidePhoneFocus}
          onFocusCapture={showPhoneFocus}
          onBlurCapture={handlePhoneBlur}
        >
          <div
            className="device-render"
            role="button"
            tabIndex={0}
            onClick={activatePhone}
            onKeyDown={handlePhoneKeyDown}
            aria-label={mode === 'home' ? 'Click phone to begin the setup guide' : 'Focus the setup guide phone'}
          >
            <div className="screen-aperture">
              <div className="operator-screen">
                <div className="phone-status"><span>9:41</span><span>▮▮▮ &nbsp; 5G &nbsp; ▰</span></div>
                {mode === 'home' && (
                  <div className="phone-welcome">
                    <div className="phone-brand-mark"><span /><span /><span /></div>
                    <p className="phone-kicker">Stay Automatic</p>
                    <h2>Click here <br />to begin</h2>
                    <p>Answer a few plain-English questions. Get a setup guide for your first useful agent.</p>
                    <span className="phone-start-pill" data-action="start-blueprint">Open guide <b>→</b></span>
                    <small>About five minutes · No credentials</small>
                  </div>
                )}

                {mode === 'intake' && activeQuestion && (
                  <div className="intake-shell">
                    <div className="intake-head">
                      <button type="button" onClick={goBack} aria-label="Go back">‹</button>
                      <div><strong>Build my guide</strong><small>{String(step + 1).padStart(2, '0')} / {questions.length}</small></div>
                      <span>{progress}%</span>
                    </div>
                    <div className="progress-track"><i style={{ width: `${progress}%` }} /></div>
                    <div className="question-stage" key={String(activeQuestion.key)}>
                      <p className="question-kicker">{activeQuestion.kicker}</p>
                      <h2>{activeQuestion.title}</h2>
                      <p className="question-hint">{activeQuestion.hint}</p>

                      {activeQuestion.open && (
                        <div className="open-answer">
                          <textarea data-question="goal" value={answers.goal} onChange={(event) => updateAnswer('goal', event.target.value)} placeholder="Example: leads arrive by email and text, then somebody has to remember to copy them into our sheet…" maxLength={700} />
                          <button type="button" className={voiceState === 'listening' ? 'voice-entry listening' : 'voice-entry'} onClick={startVoice}>
                            <span className="mic-icon" aria-hidden="true" />
                            {voiceState === 'listening' ? 'Listening…' : 'Answer by voice'}
                          </button>
                          {voiceState === 'unsupported' && <small role="status">Voice is not supported here. Type your answer instead.</small>}
                          {voiceState === 'error' && <small role="status">Microphone permission was blocked. Type your answer instead.</small>}
                        </div>
                      )}

                      {activeQuestion.options && (
                        <div className={`option-list ${activeQuestion.multiple ? 'multi' : ''}`}>
                          {activeQuestion.options.map((option) => {
                            const selected = selectedValues.includes(option)
                            return <button type="button" key={option} className={selected ? 'option-button selected' : 'option-button'} onClick={() => chooseOption(option)}><span>{selected ? '✓' : ''}</span>{option}</button>
                          })}
                        </div>
                      )}
                    </div>
                    {(activeQuestion.open || activeQuestion.multiple) && <button type="button" className="continue-button" onClick={continueStep} disabled={!canContinue()}>Continue <span>→</span></button>}
                    <p className="privacy-note">No passwords, API keys, or payment details.</p>
                  </div>
                )}

                {mode === 'blueprint' && blueprint && (
                  <div className="blueprint-view">
                    <div className="blueprint-topline"><span>Your setup guide is ready</span><button type="button" onClick={startBlueprint}>Start over</button></div>
                    <div className="blueprint-hero">
                      <small>Recommended first lane</small>
                      <h2>{blueprint.recommendation.title}</h2>
                      <span>{blueprint.recommendation.kind}</span>
                      <p>{blueprint.recommendation.outcome}</p>
                    </div>
                    <section><h3>Why this fits</h3><p>{blueprint.recommendation.reason}</p></section>
                    <section><h3>Human approval</h3><p>{blueprint.boundary.humanApproval}</p></section>
                    <section><h3>What to install</h3>{blueprint.stack.map((item) => <div className="stack-row" key={item.name}><div><strong>{item.name}</strong><p>{item.role}</p></div><span className={item.requirementStatus}>{item.requirementStatus === 'verify' ? 'Verify' : 'Core'}</span><small>{item.requirement}</small></div>)}</section>
                    <section><h3>Skills to start with</h3><div className="skill-list">{blueprint.skills.map((skill) => <span key={skill}>{skill}</span>)}</div></section>
                    <section><h3>What to build first</h3><ol>{blueprint.nextSteps.map((item) => <li key={item}>{item}</li>)}</ol></section>
                    <div className="blueprint-actions">
                      <a href={emailHref}>Send my guide <span>→</span></a>
                      <button type="button" onClick={downloadManifest}>Download setup guide</button>
                    </div>
                    <p className="blueprint-disclaimer">Account plans, APIs, and OAuth access are verified before implementation. Never send credentials by email.</p>
                  </div>
                )}
              </div>
            </div>
            <div className="screen-glass" aria-hidden="true" />
            <img className="phone-frame" src="/generated/sa-functional-phone-frame-isolated.png" alt="Photoreal smartphone frame around the live Stay Automatic onboarding" />
          </div>
        </figure>

        <aside className="workflow-strip" aria-label="What the setup guide produces">
          <p className="strip-title">Your guide builds live</p>
          <div className="guide-preview-card" aria-hidden="true">
            <div className="guide-preview-top">
              <span>Setup guide</span>
              <b>{mode === 'blueprint' ? 'Ready' : `${progress}%`}</b>
            </div>
            <div className="guide-preview-line guide-preview-line-long" />
            <div className="guide-preview-line" />
            <div className="guide-preview-modules">
              <i />
              <i />
              <i />
            </div>
          </div>
          <div className="build-signals">
            <div className={step >= 0 && mode !== 'home' ? 'active' : ''}><span>01</span><strong>Business profile</strong><small>Work, team, owner</small></div>
            <div className={step >= 3 && mode !== 'home' ? 'active' : ''}><span>02</span><strong>Workflow candidates</strong><small>One useful first lane</small></div>
            <div className={step >= 4 && mode !== 'home' ? 'active' : ''}><span>03</span><strong>Accounts and access</strong><small>Providers, roles, checks</small></div>
            <div className={mode === 'blueprint' ? 'active complete' : ''}><span>04</span><strong>Setup guide</strong><small>Skills, boundaries, pilot</small></div>
          </div>
          <p className="strip-foot">The recommendation engine does not guess provider account tiers. Anything that depends on current API or OAuth policy is marked <b>Verify.</b></p>
        </aside>
      </section>
    </main>
  )
}

export default App
