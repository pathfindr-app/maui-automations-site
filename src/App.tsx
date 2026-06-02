import { useEffect, useRef, useState } from 'react'
import HeroVisual from './components/HeroVisual'

const assetPath = (path: string) => `${import.meta.env.BASE_URL}${path}`

const audienceTags = ['Food trucks', 'Roofing companies', 'Trades', 'Sales teams', 'Property managers', 'Photographers']

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
  'Roof photos and job context become a first pass, then a reviewed final report.',
  'A bounced lead email becomes a website/contact-path audit opportunity.',
  'A customer photo packet becomes a job folder, report draft, and QA checklist.',
  'A website issue becomes a logged fix, tested change, and shipped update.',
]

const workSamples = [
  {
    id: '01',
    title: 'Snorkel Report Maui',
    summary: 'Automated ocean-conditions platform that scrapes multiple sources, scores snorkel spots, and dynamically adjusts recommendations using webcam screenshots and wind-aware logic.',
    detail: 'Acquired by The Snorkel Store and now part of their customer path: live ocean data becomes a simple daily decision tool for Maui visitors.',
    image: assetPath('project-shots/snorkel-report-live.png'),
    href: 'https://snorkelreportmaui.com',
    logo: assetPath('logos/clients/snorkel-store-logo.png'),
    client: 'Bought by The Snorkel Store',
    meta: 'Acquired product / data automation / ocean conditions',
  },
  {
    id: '02',
    title: 'Roofing Report Workflow',
    summary: 'Inspection-report workflow used by Lava Roofing to turn roof photos, job context, and inspector corrections into polished customer-facing reports.',
    detail: 'Built from field experience: send the job info and photos, get the first pass back, correct it by text or voice, then approve the final deliverable before the customer sees it.',
    image: assetPath('robot-roofing-inspection-v1.png'),
    logo: assetPath('logos/clients/lava-roofing-logo.png'),
    client: 'Used by Lava Roofing',
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

const foodTruckDeckPages = [
  'Running a food truck means running 12 jobs at once.',
  'We connect everything. AI does the rest.',
  'We build the system. AI runs the busywork.',
  'Single image. Done.',
  'AI Ad Manager.',
  'Customer Retention.',
  'Stop Renting Software. Start Hiring Intelligence.',
]

const foodTruckSystems = [
  {
    title: 'Social posting from one photo',
    body: 'Send a food photo and a few details. The system drafts the caption, holds for approval, then schedules the post where it belongs.',
  },
  {
    title: 'Ads without app babysitting',
    body: 'Offer ideas, campaign copy, creative checks, and reporting can move through one review queue instead of five scattered tabs.',
  },
  {
    title: 'Retention that keeps locals coming back',
    body: 'Review requests, follow-ups, offers, and repeat-customer nudges become a workflow — not another thing the owner has to remember.',
  },
]

function FoodTrucksPage() {
  return (
    <main className="site-shell food-truck-page">
      <section className="food-hero">
        <div className="topbar food-topbar">
          <a className="brand-lockup food-brand-link" href={assetPath('./')}>
            <span className="menu-glyph" aria-hidden="true">≡</span>
            <span className="brand-name">Stay Automatic</span>
          </a>
          <a className="contact-chip" href="tel:18082507337">808.250.7337</a>
        </div>

        <div className="food-hero-grid">
          <div className="food-hero-copy">
            <p className="eyebrow">For food trucks / operators / owners</p>
            <h1>Cook the food. We’ll catch the rest.</h1>
            <div className="title-rule" />
            <p className="lede">
              Food trucks run on tiny teams and constant context switching: orders, posts, reviews, ads, menus, invoices, messages, and repeat customers. Stay Automatic builds one practical AI operations layer for the busywork that keeps slipping between apps.
            </p>
            <div className="hero-actions">
              <a className="primary-link" href={assetPath('food-trucks/food-truck-automation-scroll-deck.pdf')} target="_blank" rel="noreferrer">Open the slide deck</a>
              <a className="secondary-link" href="#food-truck-deck">View the deck on page</a>
            </div>
          </div>

          <div className="food-hero-card" aria-label="Food truck automation slide deck preview">
            <img src={assetPath('food-trucks/deck/page-1.jpg')} alt="Food truck owner overwhelmed by twelve jobs at once" />
            <div className="food-hero-card-caption">
              <span>01 / pitch deck</span>
              <strong>Built for the work that happens after the lunch rush.</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="marquee-band" aria-label="Food truck automation positioning">
        <div className="marquee-track">
          <span>Posts, ads, reviews, reminders, menus, reports</span>
          <span>One AI operations layer</span>
          <span>Approval gates stay human</span>
          <span>Stop renting software. Start hiring intelligence.</span>
          <span>Posts, ads, reviews, reminders, menus, reports</span>
        </div>
      </section>

      <section className="content-band food-offer-band">
        <div className="section-heading wide-heading">
          <p className="section-index">01 / The offer</p>
          <h2>A working system, not another dashboard.</h2>
          <p className="section-lede">
            The promise is simple: connect the apps a food truck already uses, add a small approval queue, and let AI handle the repeatable setup work around marketing, retention, and customer follow-through.
          </p>
        </div>
        <div className="food-system-grid">
          {foodTruckSystems.map((system, index) => (
            <article className="food-system-card" key={system.title}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <h3>{system.title}</h3>
              <p>{system.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="content-band stack-band food-breakdown-band">
        <div className="section-heading compact-heading">
          <p className="section-index">02 / What gets installed</p>
          <h2>The owner keeps judgment. The system handles motion.</h2>
        </div>
        <div className="food-breakdown-grid">
          <div className="food-breakdown-copy">
            <h3>Starter setup from $500. Full setup from $750.</h3>
            <p>
              Typical monthly infrastructure can stay tiny: roughly the cost of lightweight hosting plus AI access. Ongoing support is available when the truck wants new workflows, edits, or maintenance.
            </p>
          </div>
          <div className="food-signal-list" aria-label="Food truck workflow examples">
            <span>Send photo → draft post → approve → schedule</span>
            <span>Review comes in → classify → draft response → owner approves</span>
            <span>Slow weekday → suggest offer → generate creative → hold for review</span>
            <span>Customer list → repeat-customer nudge → track follow-up</span>
          </div>
        </div>
      </section>

      <section className="content-band food-deck-band" id="food-truck-deck">
        <div className="section-heading wide-heading">
          <p className="section-index">03 / Slide deck</p>
          <h2>Food-truck automation, page by page.</h2>
          <p className="section-lede">
            This is the same prospect-facing deck as a downloadable PDF, embedded here as a clean scroll for food-truck owners who land on the site from a link or text message.
          </p>
        </div>
        <div className="deck-actions-row">
          <a className="primary-link" href={assetPath('food-trucks/food-truck-automation-scroll-deck.pdf')} target="_blank" rel="noreferrer">Download PDF</a>
          <a className="secondary-link" href="mailto:kyle@stayautomatic.com?subject=Food%20truck%20automation%20setup">Ask about a setup</a>
        </div>
        <div className="deck-scroll" aria-label="Food truck automation slide deck pages">
          {foodTruckDeckPages.map((title, index) => (
            <figure className="deck-page-card" key={title}>
              <img src={assetPath(`food-trucks/deck/page-${index + 1}.jpg`)} alt={`Slide ${index + 1}: ${title}`} loading="eager" />
              <figcaption><span>{String(index + 1).padStart(2, '0')}</span>{title}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="content-band cta-band food-cta-band" id="food-truck-start">
        <div className="cta-topline">
          <div>
            <p className="section-index">04 / Start here</p>
            <h2>Pick one workflow that keeps falling through the cracks.</h2>
            <p>
              Social posts, ad ideas, customer retention, review replies, menu updates, or daily admin. Start with one system, prove it, then add the next piece.
            </p>
          </div>
          <div className="cta-summary-card">
            <span className="service-number">Food truck setup</span>
            <div className="aftercare-mini-list"><span>Map the workflow</span><span>Build the system</span><span>Keep approvals human</span><span>Improve weekly</span></div>
          </div>
        </div>
        <div className="cta-actions">
          <a href="mailto:kyle@stayautomatic.com">kyle@stayautomatic.com</a>
          <a href="tel:18082507337">808.250.7337</a>
          <a href={assetPath('./')}>Back to Stay Automatic</a>
        </div>
      </section>
    </main>
  )
}

function HomePage() {
  const [activeWorkId, setActiveWorkId] = useState(workSamples[1].id)
  const activeWork = workSamples.find((sample) => sample.id === activeWorkId) ?? workSamples[0]
  const workDeckRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const deck = workDeckRef.current
    if (!deck) return

    const updateCardFocus = () => {
      const deckBox = deck.getBoundingClientRect()
      const deckCenter = deckBox.left + deckBox.width / 2
      const cards = Array.from(deck.querySelectorAll<HTMLButtonElement>('.work-deck-card'))
      cards.forEach((card) => {
        const box = card.getBoundingClientRect()
        const cardCenter = box.left + box.width / 2
        const distance = Math.abs(deckCenter - cardCenter)
        const focus = Math.max(0, 1 - distance / Math.max(deckBox.width * 0.52, 1))
        card.style.setProperty('--proximity', focus.toFixed(3))
      })
    }

    updateCardFocus()
    deck.addEventListener('scroll', updateCardFocus, { passive: true })
    window.addEventListener('resize', updateCardFocus)
    return () => {
      deck.removeEventListener('scroll', updateCardFocus)
      window.removeEventListener('resize', updateCardFocus)
    }
  }, [])

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
              Example: send roof photos and job context, get the first report pass back, then refine it by text or voice before the final version is formatted.
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

      <section className="content-band systems-image-band" id="agentic">
        <div className="section-heading wide-heading">
          <p className="section-index">02 / The operating layer</p>
          <h2>Replace app chaos with one clean command path.</h2>
          <p className="section-lede">
            The stack still exists — email, calendars, CRMs, documents, photos, payments, models, and servers — but the operator should not have to stare at all of it. Stay Automatic turns the mess into one reviewed workflow queue.
          </p>
        </div>
        <figure className="homepage-infographic stack-infographic">
          <img src={assetPath('generated/local-business-stack-deck-style.png')} alt="Local business app chaos connected into one AI operations hub and a simple phone task list." />
          <figcaption>
            Apps stay connected in the background. The owner gets the short version: what happened, what needs approval, and what is already done.
          </figcaption>
        </figure>
      </section>

      <section className="content-band frontpage-proof-band" id="problems">
        <div className="section-heading wide-heading">
          <p className="section-index">03 / Business foundation</p>
          <h2>One message. Finished business work.</h2>
          <p className="section-lede">
            The same pattern works across local operators: a normal request comes in, the system gathers context, prepares the work, and holds anything sensitive for approval before it reaches a customer.
          </p>
        </div>
        <figure className="homepage-infographic universal-infographic">
          <img src={assetPath('generated/message-to-business-work-deck-style.png')} alt="A plain language message becoming finished business work across roofing, ocean reports, photography, food trucks, and local services." />
          <figcaption>
            Reports, replies, posts, invoices, customer follow-ups, schedules, and delivery folders — handled by the same operating layer, tuned for the business in front of it.
          </figcaption>
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
          <div className="work-deck-list" role="tablist" aria-label="Project demos" ref={workDeckRef}>
            {workSamples.map((sample) => {
              const isActive = sample.id === activeWork.id
              return (
                <button id={`work-tab-${sample.id}`} className={`work-deck-card${isActive ? ' work-deck-card-active' : ''}`} type="button" role="tab" tabIndex={isActive ? 0 : -1} aria-selected={isActive} aria-controls="active-work-panel" key={sample.id} onClick={() => setActiveWorkId(sample.id)}>
                  <span className="work-deck-thumb" aria-hidden="true"><img src={sample.image} alt="" /></span>
                  <span className="work-deck-number">{sample.id}</span>
                  <span className="work-deck-text"><span className="work-deck-title">{sample.title}</span>{sample.client ? <span className="client-proof">{sample.client}</span> : null}<span className="work-deck-meta">{sample.meta}</span></span>
                </button>
              )
            })}
          </div>

          <article className="work-feature-panel" id="active-work-panel" role="tabpanel" aria-labelledby={`work-tab-${activeWork.id}`}>
            <div className="work-feature-media"><img src={activeWork.image} alt={activeWork.title} /></div>
            <div className="work-feature-copy">
              {activeWork.logo ? <div className="client-logo-lockup"><span>{activeWork.client}</span><img src={activeWork.logo} alt={`${activeWork.client} logo`} /></div> : null}
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

      <section className="content-band cta-band contact-band" id="start-here">
        <div className="contact-layout">
          <div className="contact-copy">
            <p className="section-index">05 / Get in contact</p>
            <h2>Bring one annoying workflow.</h2>
            <p>
              Tell us what gets repeated, where it currently lives, and what “done” should look like. We will map the cleanest first build and keep the approval points where human judgment belongs.
            </p>
            <div className="cta-actions">
              <a href="mailto:kyle@stayautomatic.com">kyle@stayautomatic.com</a>
              <a href="tel:18082507337">808.250.7337</a>
              <a href={assetPath('food-trucks/')}>See the food-truck example</a>
            </div>
          </div>
          <figure className="contact-visual">
            <img src={assetPath('generated/local-business-stack-deck-style.png')} alt="A local business automation hub turning app chaos into a clean approval queue." />
            <figcaption>Start with one workflow. Prove it. Then add the next one.</figcaption>
          </figure>
        </div>
      </section>

    </main>
  )
}

function App() {
  const params = new URLSearchParams(window.location.search)
  const isFoodTruckPage = window.location.pathname.includes('food-trucks') || params.get('page') === 'food-trucks'
  document.title = isFoodTruckPage ? 'Food Truck Automation — Stay Automatic' : 'Stay Automatic'
  return isFoodTruckPage ? <FoodTrucksPage /> : <HomePage />
}

export default App
