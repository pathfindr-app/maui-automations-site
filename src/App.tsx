import HeroVisual from './components/HeroVisual'
import IntakeConsole from './components/IntakeConsole'
import ShowcaseCard from './components/ShowcaseCard'

const foundationPoints = [
  'Organize customer info, job details, notes, files, and follow-ups',
  'Connect email, forms, calendars, CRMs, spreadsheets, and messaging apps',
  'Install AI workflows for real estate, trades, property managers, teachers, and sales teams',
]

const audienceTags = ['Real estate', 'Trades', 'Teachers', 'Property managers', 'Sales teams', 'Local operators']

const buildList = [
  {
    id: '01',
    title: 'Autonomous workflow systems',
    body: 'AI systems that handle follow-up, routing, reminders, reports, and repeated admin.',
  },
  {
    id: '02',
    title: 'AI-ready operations consulting',
    body: 'A practical plan for where your data should live and which workflows should be automated first.',
  },
  {
    id: '03',
    title: 'Private and frontier AI setups',
    body: 'Private, frontier, or hybrid AI setups depending on what your business needs to protect.',
  },
]

const workSamples = [
  {
    id: '01',
    title: 'Snorkel Report Maui',
    summary: 'Automated ocean-conditions platform that scrapes multiple sources, scores snorkel spots, and dynamically adjusts recommendations using webcam screenshots and wind-aware logic.',
    detail: 'Built to run continuously with almost no hosting cost. It has operated for 4+ months without delays while translating messy marine data into a simple daily decision tool.',
    image: '/project-shots/snorkel-report-live.png',
    href: 'https://snorkelreportmaui.com',
    meta: 'Live product / data automation / low-cost hosting',
  },
  {
    id: '02',
    title: 'Lava Roofing Report Builder',
    summary: 'Agentic inspection-report workflow that turns photos and notes into polished, branded roofing inspection summaries customers can immediately understand.',
    detail: 'Helps customer acquisition and satisfaction by making the company\'s attention to detail visible and easy to trust, without slowing down the team in the field.',
    image: '/ops-desk-v1.png',
    meta: 'Internal AI workflow / branded deliverables / sales enablement',
  },
  {
    id: '03',
    title: 'Photographer Delivery Automation',
    summary: 'Telegram-driven workflow for underwater and surf photographers that creates local edit folders, emails customers next steps, and automates final Dropbox delivery.',
    detail: 'One message starts the job, another finishes it. Customer data entry, file organization, uploads, and delivery links all move without repetitive manual admin.',
    image: '/command-center-v1.png',
    meta: 'Telegram agent / local file automation / client delivery',
  },
  {
    id: '04',
    title: 'Pathfindr.world',
    summary: 'Map-based geospatial game built end to end with multiple real maps, pathfinding systems, daily challenges, realtime leaderboards, and free/premium plans.',
    detail: 'Full-stack product work including backend systems, Stripe payments, user accounts, premium gating, and ongoing challenge infrastructure.',
    image: '/project-shots/pathfindr-reference.png',
    href: 'https://pathfindr.world',
    meta: 'Consumer product / payments / realtime game systems',
  },
]

const proofStats = [
  {
    value: '4+ month uptime',
    label: 'Useful systems that keep running without daily babysitting.',
  },
  {
    value: 'AI-ready data',
    label: 'Clean information makes every future tool easier to build.',
  },
  {
    value: 'Future-ready systems',
    label: 'Start with automation now. Add better tools as the business grows.',
  },
]

const process = [
  {
    id: '01',
    title: 'Map the work',
    body: 'Find where information enters, where it gets repeated, and who needs it next.',
  },
  {
    id: '02',
    title: 'Organize the data',
    body: 'Clean up the handoffs so AI and automation tools have something reliable to work with.',
  },
  {
    id: '03',
    title: 'Automate the repeatable',
    body: 'Ship the first useful workflow, test it on real work, and expand from there.',
  },
]

const engagementPoints = [
  'AI systems that fit the way your team already works',
  'Clean company information that future tools can use',
  'Team training for practical everyday AI use',
  'Privacy-first options for sensitive business data',
]

function App() {
  return (
    <main className="site-shell">
      <section className="hero-panel">
        <aside className="hero-copy">
          <div className="topbar">
            <div className="brand-lockup">
              <span className="menu-glyph">≡</span>
              <span className="brand-name">Maui Automations</span>
            </div>
            <a className="contact-chip" href="tel:18084195733">
              (808) 419-5733
            </a>
          </div>

          <div className="copy-inner">
            <p className="eyebrow">AI / Automation / Bespoke Software</p>
            <h1>
              Set up for the future.
              <br />
              <span>Less busy work now.</span>
            </h1>
            <div className="title-rule" />
          <p className="lede">
              We organize the information your business already has, then add AI and automation where it saves real time.
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
              <img src="/hero-robot-v4.png" alt="Automation sky detail preview" className="mini-image" />
              <div className="mini-card-overlay">
                <div className="inner-orbit" />
                <div className="center-node">LOCAL</div>
              </div>
            </div>
            <nav className="mini-list" aria-label="Section navigation">
              <a href="#problems">
                <span>01</span>
                How we set it up
              </a>
              <a href="#systems">
                <span>02</span>
                Systems we build
              </a>
              <a href="#work">
                <span>03</span>
                Recent work
              </a>
              <a href="#process">
                <span>04</span>
                How it works
              </a>
              <a href="#about">
                <span>05</span>
                About
              </a>
              <a href="#start-here">
                <span>06</span>
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
          <span>Built locally in Maui</span>
          <span>Data foundations, autonomous systems, bespoke software</span>
          <span>Clearer workflows. Better data. More leverage.</span>
          <span>AI-ready operations for real businesses</span>
          <span>Built locally in Maui</span>
        </div>
      </section>

      <section className="content-band" id="problems">
        <div className="section-heading">
          <p className="section-index">01 / How we set it up</p>
          <h2>Organize first. Automate second.</h2>
        </div>
        <div className="foundation-grid">
          {foundationPoints.map((point) => (
            <article className="line-item" key={point}>
              <span className="line-item-index">+</span>
              <p>{point}</p>
            </article>
          ))}
        </div>
        <div className="audience-strip" aria-label="Example businesses">
          <span>Built for everyday operators</span>
          {audienceTags.map((tag) => (
            <p key={tag}>{tag}</p>
          ))}
        </div>
      </section>

      <section className="content-band stats-band">
        <div className="section-heading compact-heading">
          <p className="section-index">Signal / Outcomes</p>
          <h2>Less admin now. Better tools later.</h2>
        </div>
        <div className="stats-grid">
          {proofStats.map((stat, index) => (
            <article className="stat-card" key={stat.value}>
              <span className="stat-kicker">{`0${index + 1}`}</span>
              <h3>{stat.value}</h3>
              <p>{stat.label}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="content-band accent-band" id="systems">
        <div className="section-heading">
          <p className="section-index">02 / Systems we build</p>
          <h2>Useful AI systems for everyday operations.</h2>
        </div>
        <div className="service-grid rich-grid">
          {buildList.map((item) => (
            <article className="service-card rich-card" key={item.title}>
              <span className="service-number">{item.id}</span>
              <div>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </div>
              <span className="service-signal" />
            </article>
          ))}
        </div>
      </section>

      <section className="content-band image-band" id="work">
        <div className="section-heading compact-heading">
          <p className="section-index">03 / Recent work</p>
          <h2>Proof across local business automation, internal tooling, and full-stack products.</h2>
        </div>
        <div className="showcase-stack">
          {workSamples.map((sample, index) => (
            <ShowcaseCard
              key={sample.id}
              id={sample.id}
              title={sample.title}
              summary={sample.summary}
              detail={sample.detail}
              image={sample.image}
              href={sample.href}
              meta={sample.meta}
              reverse={index % 2 === 1}
            />
          ))}
        </div>
      </section>

      <section className="content-band split-band" id="process">
        <div className="section-heading compact-heading">
          <p className="section-index">04 / How it works</p>
          <h2>Map. Organize. Automate.</h2>
        </div>
        <div className="process-list detailed-process">
          {process.map((step) => (
            <article className="process-row expanded-process" key={step.title}>
              <span>{step.id}</span>
              <div>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="content-band about-band" id="about">
        <div className="section-heading compact-heading">
          <p className="section-index">05 / About</p>
          <h2>Practical AI setup for Maui businesses.</h2>
        </div>
        <div className="about-column">
          <p className="about-copy">
            The goal is simple: make the business easier to run today and easier to build on tomorrow.
          </p>
          <div className="bullet-list" aria-label="Engagement options">
            {engagementPoints.map((item) => (
              <div className="bullet-row" key={item}>
                <span>+</span>
                <p>{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="content-band cta-band" id="start-here">
        <div className="cta-topline">
          <div>
            <p className="section-index">06 / Start here</p>
            <h2>Bring the messy workflow.</h2>
            <p>
              Tell us where work slows down, where the information lives, and what you wish happened automatically.
            </p>
          </div>
          <div className="cta-summary-card">
            <span className="service-number">Placeholder</span>
            <p>Best first message: what gets repeated, who touches it, and what “done” should look like.</p>
          </div>
        </div>

        <IntakeConsole />

        <div className="cta-actions">
          <a href="mailto:hello@mauiautomations.com">hello@mauiautomations.com</a>
          <a href="tel:18084195733">(808) 419-5733</a>
        </div>
      </section>
    </main>
  )
}

export default App
