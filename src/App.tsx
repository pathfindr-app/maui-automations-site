import { useState } from 'react'
import HeroVisual from './components/HeroVisual'

const assetPath = (path: string) => `${import.meta.env.BASE_URL}${path}`

const audienceTags = ['Real estate', 'Trades', 'Teachers', 'Property managers', 'Sales teams', 'Local operators']

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
    title: 'Local Roofing Company',
    summary: 'Inspection-report workflow that turns roof photos and notes into polished summaries customers can immediately understand.',
    detail: 'Helps customer acquisition and satisfaction by making the company\'s attention to detail visible and easy to trust, without slowing down the team in the field.',
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

const aftercarePoints = [
  'Maintain it',
  'Upgrade it',
  'Train your team',
  'Add the next workflow',
]

function App() {
  const [activeWorkId, setActiveWorkId] = useState(workSamples[0].id)
  const activeWork = workSamples.find((sample) => sample.id === activeWorkId) ?? workSamples[0]

  return (
    <main className="site-shell">
      <section className="hero-panel">
        <aside className="hero-copy">
          <div className="topbar">
            <div className="brand-lockup">
              <span className="menu-glyph">≡</span>
              <span className="brand-name">Stay Automatic</span>
            </div>
            <a className="contact-chip" href="tel:18082507337">
              808.250.7337
            </a>
          </div>

          <div className="copy-inner">
            <p className="eyebrow">AI / Automation / Bespoke Software</p>
            <h1>
              You live on an island. Not your phone.
            </h1>
            <div className="title-rule" />
          <p className="lede">
              We build practical systems that keep the repetitive parts of your business moving, then keep improving them as better tools arrive.
            </p>
            <div className="hero-actions">
              <a className="primary-link" href="#start-here">
                Let&apos;s map the bottleneck
              </a>
              <a className="secondary-link" href="#work">
                See what this unlocks
              </a>
            </div>
          </div>

          <div className="info-grid">
            <div className="mini-card photo-card">
              <img src={assetPath('hero-robot-v4.png')} alt="Automation sky detail preview" className="mini-image" />
              <div className="mini-card-overlay">
                <div className="inner-orbit" />
                <div className="center-node">LOCAL</div>
              </div>
            </div>
            <nav className="mini-list" aria-label="Section navigation">
              <a href="#problems">
                <span>01</span>
                Map the business
              </a>
              <a href="#work">
                <span>02</span>
                Project demos
              </a>
              <a href="#start-here">
                <span>03</span>
                Start here
              </a>
            </nav>
          </div>
        </aside>

        <HeroVisual />
      </section>

      <section className="marquee-band" aria-label="Studio positioning">
        <div className="marquee-track">
          <span>AI-ready operations for real businesses</span>
          <span>Built from Hawaii for practical operators</span>
          <span>Data foundations, autonomous systems, bespoke software</span>
          <span>Clearer workflows. Better data. More leverage.</span>
          <span>AI-ready operations for real businesses</span>
          <span>Built from Hawaii for practical operators</span>
        </div>
      </section>

      <section className="content-band" id="problems">
        <div className="section-heading">
          <p className="section-index">01 / Business foundation</p>
          <h2>Stop buying apps. Start building leverage.</h2>
        </div>
        <figure className="foundation-visual">
          <img
            src={assetPath('generated/message-to-robot-workflow-v1.png')}
            alt="A photographer sends a finished editing message and an AI assistant handles upload and customer delivery."
          />
          <figcaption>
            One message can trigger the tedious follow-through: organize files, upload work, notify customers, and keep a clean record.
          </figcaption>
        </figure>
        <figure className="paradigm-image">
          <img
            src={assetPath('generated/paradigm-comparison-v1.png')}
            alt="Old paradigm: problem to computer to apps to manual task to solution. New paradigm: problem to computer to solution."
          />
        </figure>
        <div className="audience-strip" aria-label="Example businesses">
          <span>Built for everyday operators</span>
          {audienceTags.map((tag) => (
            <p key={tag}>{tag}</p>
          ))}
        </div>
      </section>

      <section className="content-band work-deck-band" id="work">
        <div className="section-heading compact-heading">
          <p className="section-index">02 / Project demos</p>
          <h2>Click a build. See what it actually does.</h2>
        </div>
        <div className="work-deck-shell">
          <div className="work-deck-list" role="tablist" aria-label="Project demos">
            {workSamples.map((sample) => {
              const isActive = sample.id === activeWork.id

              return (
                <button
                  className={`work-deck-card${isActive ? ' work-deck-card-active' : ''}`}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-controls="active-work-panel"
                  key={sample.id}
                  onClick={() => setActiveWorkId(sample.id)}
                >
                  <span className="work-deck-thumb" aria-hidden="true">
                    <img src={sample.image} alt="" />
                  </span>
                  <span className="work-deck-number">{sample.id}</span>
                  <span className="work-deck-text">
                    <span className="work-deck-title">{sample.title}</span>
                    <span className="work-deck-meta">{sample.meta}</span>
                  </span>
                </button>
              )
            })}
          </div>

          <article className="work-feature-panel" id="active-work-panel" role="tabpanel">
            <div className="work-feature-media">
              <img src={activeWork.image} alt={activeWork.title} />
            </div>
            <div className="work-feature-copy">
              <span className="work-id">{activeWork.id}</span>
              <h3>{activeWork.title}</h3>
              <p>{activeWork.summary}</p>
              <p className="showcase-detail">{activeWork.detail}</p>
              <div className="showcase-meta-row">
                <span className="showcase-meta">{activeWork.meta}</span>
                {activeWork.href ? (
                  <a className="showcase-link" href={activeWork.href} target="_blank" rel="noreferrer">
                    Visit live project
                  </a>
                ) : null}
              </div>
            </div>
          </article>
        </div>
      </section>

      <section className="content-band cta-band" id="start-here">
        <div className="cta-topline">
          <div>
            <p className="section-index">03 / Start here</p>
            <h2>Make one workflow lighter.</h2>
            <p>
              Tell us what gets repeated, who touches it, and what done should look like. We will map the cleanest first build.
            </p>
          </div>
          <div className="cta-summary-card">
            <span className="service-number">After setup</span>
            <div className="aftercare-mini-list">
              {aftercarePoints.map((point) => (
                <span key={point}>{point}</span>
              ))}
            </div>
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
