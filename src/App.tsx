import { useState } from 'react'
import HeroVisual from './components/HeroVisual'

const assetPath = (path: string) => `${import.meta.env.BASE_URL}${path}`

const audienceTags = ['Roofing companies', 'Trades', 'Sales teams', 'Property managers', 'Photographers', 'Local operators']

const stackLogos = [
  { name: 'ChatGPT / OpenAI', capability: 'Reads the request', role: 'Understands normal messages and job context.', logo: assetPath('logos/openai.svg') },
  { name: 'Anthropic / Claude', capability: 'Reviews the work', role: 'Careful writing, critique, and second-pass QA.', logo: assetPath('logos/claude.svg') },
  { name: 'Hermes Agent', capability: 'Runs the workflow', role: 'Persistent agent with memory, tools, schedules, and approvals.', logo: assetPath('logos/hermes-agent.svg') },
  { name: 'OpenCode', capability: 'Changes the code', role: 'Coding agent in the loop for custom software updates.', logo: assetPath('logos/opencode.svg') },
  { name: 'GitHub', capability: 'Versions the system', role: 'Tracks code, fixes, deployment, and rollback paths.', logo: assetPath('logos/github-lobe.svg') },
  { name: 'VPS / Mac mini', capability: 'Stays on', role: 'A private computer/server that keeps the workflow available.', logo: assetPath('logos/apple-lobe.svg') },
]

const explainerSteps = [
  {
    kicker: 'Normal apps',
    title: 'Most software is a set of buttons someone already imagined.',
    body: 'A program is usually a fixed interface connected to a database, APIs, files, and business rules. It works beautifully when your business fits the buttons. It gets expensive when your real workflow lives between five apps, a spreadsheet, and someone\'s memory.',
  },
  {
    kicker: 'Modern AI',
    title: 'AI adds a language layer over the computer.',
    body: 'Models like ChatGPT and Claude can read, write, reason, classify, summarize, inspect images, and translate messy instructions into structured actions. On their own, they are powerful conversations. Connected to tools, they become work execution.',
  },
  {
    kicker: 'Agentic workflow',
    title: 'Agents turn language into repeatable operations.',
    body: 'An agent can receive a message, read files, check email, call APIs, run code, create documents, ask for review, update a CRM, and hand work back for approval. The important part is not the chat window — it is the workflow around it.',
  },
  {
    kicker: 'Custom computer',
    title: 'The end state is a computer that works the way your company works.',
    body: 'Stay Automatic builds the durable layer: code, templates, triggers, review gates, data stores, and deployment paths. You keep the human judgment; the system handles the repeatable motion.',
  },
]

const workflowTiles = [
  'A roofing inspection becomes a branded customer report.',
  'A bounced lead email becomes a website/contact-path audit opportunity.',
  'A customer photo packet becomes a job folder, report draft, and QA checklist.',
  'A website issue becomes a logged fix, tested change, and shipped update.',
]

const workSamples = [
  {
    id: '01',
    title: 'Snorkel Report Maui',
    summary: 'Automated ocean-conditions platform that scrapes multiple sources, scores snorkel spots, and dynamically adjusts recommendations using webcam screenshots and wind-aware logic.',
    detail: 'Built to run continuously with almost no hosting cost. It has operated for 4+ months without delays while translating messy marine data into a simple daily decision tool.',
    image: assetPath('project-shots/snorkel-report-live.png'),
    href: 'https://snorkelreportmaui.com',
    meta: 'Live product / data automation / low-cost hosting',
  },
  {
    id: '02',
    title: 'Roofing Report Workflow',
    summary: 'Inspection-report workflow that turns roof photos, findings, and recommendations into polished customer-facing reports.',
    detail: 'Built from field experience: the inspector stays in control, the report comes back for review, and the final deliverable looks like the roofing company — not generic AI output.',
    image: assetPath('robot-roofing-inspection-v1.png'),
    meta: 'Inspection reports / branded deliverables / sales enablement',
  },
  {
    id: '03',
    title: 'Photographer Delivery Automation',
    summary: 'Telegram-driven workflow for underwater and surf photographers that creates local edit folders, emails customers next steps, and automates final Dropbox delivery.',
    detail: 'One message starts the job, another finishes it. Customer data entry, file organization, uploads, and delivery links all move without repetitive manual admin.',
    image: assetPath('robot-surfing-v1.png'),
    meta: 'Telegram agent / local file automation / client delivery',
  },
  {
    id: '04',
    title: 'Pathfindr.world',
    summary: 'Map-based geospatial game built end to end with multiple real maps, pathfinding systems, daily challenges, realtime leaderboards, and free/premium plans.',
    detail: 'Full-stack product work including backend systems, Stripe payments, user accounts, premium gating, and ongoing challenge infrastructure.',
    image: assetPath('project-shots/pathfindr-reference.png'),
    href: 'https://pathfindr.world',
    meta: 'Consumer product / payments / realtime game systems',
  },
]

const aftercarePoints = ['Maintain it', 'Upgrade it', 'Train your team', 'Add the next workflow']

function App() {
  const [activeWorkId, setActiveWorkId] = useState(workSamples[1].id)
  const activeWork = workSamples.find((sample) => sample.id === activeWorkId) ?? workSamples[0]

  return (
    <main className="site-shell">
      <section className="hero-panel">
        <aside className="hero-copy">
          <div className="topbar">
            <div className="brand-lockup">
              <span className="menu-glyph" aria-hidden="true">≡</span>
              <span className="brand-name">Stay Automatic</span>
            </div>
            <a className="contact-chip" href="tel:18082507337">808.250.7337</a>
          </div>

          <div className="copy-inner">
            <p className="eyebrow">AI / Automation / Custom Software</p>
            <h1>Give AI a workflow it can run.</h1>
            <div className="title-rule" />
            <p className="lede">
              We build practical operating systems for small companies: the code, agents, templates, and review gates that let plain-language instructions turn into finished business work.
            </p>
            <p className="hero-proof">
              Example: send roof photos and notes; the workflow drafts a branded inspection report your team reviews before the customer sees it.
            </p>
            <div className="hero-actions">
              <a className="primary-link" href="#start-here">Start with one workflow</a>
              <a className="secondary-link" href="#work">See the roofing workflow</a>
            </div>
          </div>

          <div className="info-grid">
            <div className="mini-card photo-card">
              <img src={assetPath('hero-robot-v4.png')} alt="Automation system preview" className="mini-image" />
              <div className="mini-card-overlay">
                <div className="inner-orbit" />
                <div className="center-node">SYSTEM</div>
              </div>
            </div>
            <nav className="mini-list" aria-label="Section navigation">
              <a href="#how-it-works"><span>01</span>How it works</a>
              <a href="#agentic"><span>02</span>Agent workflows</a>
              <a href="#work"><span>03</span>Project demos</a>
            </nav>
          </div>
        </aside>

        <HeroVisual />
      </section>

      <section className="marquee-band" aria-label="Studio positioning">
        <div className="marquee-track">
          <span>Custom workflows for real operators</span>
          <span>AI connected to code, files, email, and approvals</span>
          <span>Not another app to babysit</span>
          <span>A computer that works the way your company works</span>
          <span>Custom workflows for real operators</span>
        </div>
      </section>

      <section className="content-band explainer-band" id="how-it-works">
        <div className="section-heading wide-heading">
          <p className="section-index">01 / What changed</p>
          <h2>AI is no longer just a chat box. It can sit inside the way work moves.</h2>
          <p className="section-lede">
            The practical shift is simple: modern models can understand messy language, but real business workflows need more than understanding. They need memory, tools, rules, files, approvals, and code that runs the same way tomorrow.
          </p>
        </div>

        <div className="explainer-grid">
          {explainerSteps.map((step, index) => (
            <article className="explainer-card" key={step.title}>
              <span className="explainer-number">{String(index + 1).padStart(2, '0')}</span>
              <p className="explainer-kicker">{step.kicker}</p>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="content-band stack-band" id="agentic">
        <div className="section-heading compact-heading">
          <p className="section-index">02 / The installed stack</p>
          <h2>A small company can have its own operating layer.</h2>
        </div>

        <div className="stack-layout">
          <div className="computer-card" aria-label="Diagram of a business automation computer">
            <div className="mac-mini">
              <div className="mac-topline" />
              <div className="mac-light" />
              <div className="mac-label">Stay Automatic node</div>
            </div>
            <div className="vps-rack">
              <span>VPS</span>
              <span>GitHub</span>
              <span>Gmail</span>
              <span>CRM</span>
            </div>
            <div className="natural-language-card">
              <strong>Plain-language request</strong>
              <p>“This email bounced. Find the right contact path, log the issue, and prepare the follow-up.”</p>
            </div>
          </div>

          <div className="logo-cloud" aria-label="Tools and models that can be connected into workflows">
            {stackLogos.map((tool) => (
              <div className="logo-pill" key={tool.name}>
                <span className="logo-mark" aria-hidden="true">
                  <img src={tool.logo} alt="" />
                </span>
                <div>
                  <strong>{tool.capability}</strong>
                  <p>{tool.role} <em>{tool.name}</em></p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="workflow-strip">
          {workflowTiles.map((tile) => (
            <div className="workflow-tile" key={tile}>{tile}</div>
          ))}
        </div>
      </section>

      <section className="content-band" id="problems">
        <div className="section-heading">
          <p className="section-index">03 / Business foundation</p>
          <h2>Stop buying apps. Start building leverage.</h2>
        </div>
        <figure className="foundation-visual">
          <img src={assetPath('generated/message-to-robot-workflow-v1.png')} alt="A message triggers an automation workflow across files, uploads, and customer delivery." />
          <figcaption>
            One message can trigger the tedious follow-through: organize files, upload work, notify customers, update records, and keep the human in the approval loop.
          </figcaption>
        </figure>
        <figure className="paradigm-image">
          <img src={assetPath('generated/paradigm-comparison-v1.png')} alt="Old paradigm: problem to computer to apps to manual task to solution. New paradigm: problem to computer to solution." />
        </figure>
        <div className="audience-strip" aria-label="Example businesses">
          <span>Built for everyday operators</span>
          {audienceTags.map((tag) => <p key={tag}>{tag}</p>)}
        </div>
      </section>

      <section className="content-band work-deck-band" id="work">
        <div className="section-heading compact-heading">
          <p className="section-index">04 / Project demos</p>
          <h2>Click a build. See what it actually does.</h2>
        </div>
        <div className="work-deck-shell">
          <div className="work-deck-list" role="tablist" aria-label="Project demos">
            {workSamples.map((sample) => {
              const isActive = sample.id === activeWork.id
              return (
                <button id={`work-tab-${sample.id}`} className={`work-deck-card${isActive ? ' work-deck-card-active' : ''}`} type="button" role="tab" tabIndex={isActive ? 0 : -1} aria-selected={isActive} aria-controls="active-work-panel" key={sample.id} onClick={() => setActiveWorkId(sample.id)}>
                  <span className="work-deck-thumb" aria-hidden="true"><img src={sample.image} alt="" /></span>
                  <span className="work-deck-number">{sample.id}</span>
                  <span className="work-deck-text"><span className="work-deck-title">{sample.title}</span><span className="work-deck-meta">{sample.meta}</span></span>
                </button>
              )
            })}
          </div>

          <article className="work-feature-panel" id="active-work-panel" role="tabpanel" aria-labelledby={`work-tab-${activeWork.id}`}>
            <div className="work-feature-media"><img src={activeWork.image} alt={activeWork.title} /></div>
            <div className="work-feature-copy">
              <span className="work-id">{activeWork.id}</span>
              <h3>{activeWork.title}</h3>
              <p>{activeWork.summary}</p>
              <p className="showcase-detail">{activeWork.detail}</p>
              <div className="showcase-meta-row">
                <span className="showcase-meta">{activeWork.meta}</span>
                {activeWork.href ? <a className="showcase-link" href={activeWork.href} target="_blank" rel="noreferrer">Visit live project</a> : null}
              </div>
            </div>
          </article>
        </div>
      </section>

      <section className="content-band cta-band" id="start-here">
        <div className="cta-topline">
          <div>
            <p className="section-index">05 / Start here</p>
            <h2>Make one workflow lighter.</h2>
            <p>
              Tell us what gets repeated, who touches it, and what done should look like. We will map the cleanest first build — then decide what should be automated, reviewed, or left human.
            </p>
          </div>
          <div className="cta-summary-card">
            <span className="service-number">After setup</span>
            <div className="aftercare-mini-list">{aftercarePoints.map((point) => <span key={point}>{point}</span>)}</div>
          </div>
        </div>

        <div className="cta-actions">
          <a href="mailto:kyle@stayautomatic.com">kyle@stayautomatic.com</a>
          <a href="tel:18082507337">808.250.7337</a>
        </div>
      </section>
    </main>
  )
}

export default App
