import { useEffect, useMemo, useState } from 'react'

type WorkflowKey = 'workspace' | 'social' | 'voice' | 'photos'

type Workflow = {
  key: WorkflowKey
  label: string
  eyebrow: string
  line: string
  image: string
  alt: string
  proof: string[]
}

const workflows: Workflow[] = [
  {
    key: 'workspace',
    label: 'Workspace',
    eyebrow: 'Calendar / Gmail / Drive',
    line: 'Meeting context found. Deck sent. Reminder added. No tab hunting.',
    image: '/generated/sa-art-phone-workspace.png',
    alt: 'Cinematic smartphone render showing Google Workspace AI operator workflow',
    proof: ['Calendar checked', 'Deck sent from Drive', 'Maya emailed', 'Reminder added']
  },
  {
    key: 'social',
    label: 'Social',
    eyebrow: 'Recap / Caption / Schedule',
    line: 'Yesterday became a recap. Tomorrow became a scheduled post.',
    image: '/generated/sa-art-phone-social.png',
    alt: 'Cinematic smartphone render showing social media recap and scheduling workflow',
    proof: ['50 engagements summarized', 'Caption rewritten', 'Post scheduled', 'Story queued']
  },
  {
    key: 'voice',
    label: 'Voice',
    eyebrow: 'Calls / Booking / Summary',
    line: 'After-hours calls turn into qualified bookings and morning notes.',
    image: '/generated/sa-art-phone-voice.png',
    alt: 'Cinematic smartphone render showing AI voice agent booking workflow',
    proof: ['Call answered', 'Lead qualified', 'Consultation booked', 'Summary sent']
  },
  {
    key: 'photos',
    label: 'Photos',
    eyebrow: 'Customers / Folders / Dropbox',
    line: 'Customer list in. Receipts out. Export folders ready. Delivery queued.',
    image: '/generated/sa-art-phone-photos.png',
    alt: 'Cinematic smartphone render showing photo delivery customer workflow',
    proof: ['Receipts emailed', 'Export folders created', 'Dropbox delivery staged', 'Links ready after export']
  }
]

function App() {
  const [activeKey, setActiveKey] = useState<WorkflowKey>('workspace')
  const [isSwitching, setIsSwitching] = useState(false)

  const active = useMemo(
    () => workflows.find((workflow) => workflow.key === activeKey) ?? workflows[0],
    [activeKey]
  )

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setIsSwitching(false)
    }, 520)
    return () => window.clearTimeout(timer)
  }, [activeKey])

  function chooseWorkflow(key: WorkflowKey) {
    if (key === activeKey) return
    setIsSwitching(true)
    setActiveKey(key)
  }

  return (
    <main className="page-shell">
      <header className="masthead" aria-label="Stay Automatic navigation">
        <a href="/" className="brand" aria-label="Stay Automatic home">
          <span>Stay</span> Automatic
        </a>
        <a href="mailto:kyle@stayautomatic.com" className="access-link">Request access</a>
      </header>

      <section className="hero" aria-label="Stay Automatic cinematic AI operator demo">
        <div className="editorial-copy">
          <p className="overline">AI, shown as work</p>
          <h1>Let us show you the real power of AI.</h1>
          <p className="lede">
            Not another dashboard. Not a prompt pack. A living operator that can move through the tools your business already runs on.
          </p>
          <div className="hero-actions" aria-label="Primary actions">
            <a className="action primary" href="mailto:kyle@stayautomatic.com?subject=Map%20my%20first%20AI%20workflow">Map my first workflow</a>
            <a className="action quiet" href="#workflow-selector">Change the scene</a>
          </div>
        </div>

        <figure className="phone-scene" aria-label="Cinematic phone workflow render">
          <div className="scene-light warm" />
          <div className="scene-light cool" />
          <img className={isSwitching ? 'phone-art switching' : 'phone-art'} src={active.image} alt={active.alt} />
          <figcaption className="scene-caption" aria-live="polite">
            <span>{active.eyebrow}</span>
            {active.line}
          </figcaption>
        </figure>

        <aside className="workflow-strip" aria-label="Workflow selection">
          <p className="strip-title">Four proofs, one operator</p>
          <div id="workflow-selector" className="selector" role="tablist" aria-label="Choose workflow render">
            {workflows.map((workflow, index) => {
              const selected = workflow.key === active.key
              return (
                <button
                  type="button"
                  key={workflow.key}
                  role="tab"
                  aria-selected={selected}
                  className={selected ? 'workflow-mark active' : 'workflow-mark'}
                  onClick={() => chooseWorkflow(workflow.key)}
                >
                  <span className="index">0{index + 1}</span>
                  <span className="mark-copy">
                    <strong>{workflow.label}</strong>
                    <small>{workflow.eyebrow}</small>
                  </span>
                </button>
              )
            })}
          </div>
          <ul className="proof-list" aria-live="polite">
            {active.proof.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </aside>
      </section>
    </main>
  )
}

export default App
