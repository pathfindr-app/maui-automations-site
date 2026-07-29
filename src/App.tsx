import { Canvas, useFrame } from '@react-three/fiber'
import { ContactShadows, Environment, Float, RoundedBox } from '@react-three/drei'
import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'

type WorkflowKey = 'workspace' | 'social' | 'voice' | 'photos'
type Workflow = {
  label: string
  eyebrow: string
  prompt: string
  reply: string
  actionTitle: string
  actions: string[]
  sideTitle: string
  sideCopy: string
}

const workflows: Record<WorkflowKey, Workflow> = {
  workspace: {
    label: 'Google Workspace',
    eyebrow: 'calendar, gmail, docs',
    prompt: 'What meetings do I have today? Send the deck and roof photos to Maya before we meet.',
    reply: 'You have Maya at 2:30. I sent the deck, attached the roof photos, added the claim note, and left a reminder 20 minutes before the call.',
    actionTitle: 'Done across Calendar, Gmail, and Drive',
    actions: ['Calendar checked', 'Docs attached', 'Email sent', 'Reminder added'],
    sideTitle: 'It acts across your actual workspace.',
    sideCopy: 'The point is not a prettier chatbot. It is AI that can read the calendar, find the document, send the email, and leave a clean trail.',
  },
  social: {
    label: 'Social recap + posting',
    eyebrow: 'recap, caption, schedule',
    prompt: 'How did yesterday’s post do? Also make tomorrow’s special the main post instead.',
    reply: 'Yesterday pulled 50 engagements and 7 replies. I rewrote tomorrow’s caption around the special, matched the tone, scheduled it for 8:15 AM, and queued the story version.',
    actionTitle: 'Social workflow prepared',
    actions: ['Engagement recap', 'Caption revised', 'Post scheduled', 'Story queued'],
    sideTitle: 'It reports, then moves the work forward.',
    sideCopy: 'Daily summaries become useful when the agent can turn the next instruction into the caption, post, schedule, and recap loop.',
  },
  voice: {
    label: 'After-hours calls',
    eyebrow: 'voice agent, booking',
    prompt: 'Can the AI answer after-hours calls and book the people who are ready? ',
    reply: 'Yes. It can answer, qualify the caller, offer open times, book the call, text the confirmation, and send you a summary before morning.',
    actionTitle: 'Voice intake lane',
    actions: ['Call answered', 'Lead qualified', 'Time booked', 'Summary sent'],
    sideTitle: 'Voice becomes an operator lane, not a novelty.',
    sideCopy: 'A useful voice agent has rules, calendars, escalation points, and summaries — not just a talking bot that creates more cleanup.',
  },
  photos: {
    label: 'Photo delivery',
    eyebrow: 'customer list, folders, dropbox',
    prompt: 'Here is the customer list from the boat. Set up photo delivery for everyone.',
    reply: 'I emailed receipts and instructions, created export folders on the desktop, and I’m ready to upload each customer folder to Dropbox when you finish exporting.',
    actionTitle: 'Photo delivery prepared',
    actions: ['Receipts emailed', 'Folders created', 'Dropbox queued', 'Links ready after export'],
    sideTitle: 'It turns messy customer lists into fulfilled work.',
    sideCopy: 'This is the operator pattern: accept rough input, prepare the workspace, wait at the right checkpoint, then finish delivery cleanly.',
  },
}

const order: WorkflowKey[] = ['workspace', 'social', 'voice', 'photos']

function PhoneModel() {
  const group = useRef<THREE.Group>(null)

  useFrame(({ clock, pointer }) => {
    if (!group.current) return
    const t = clock.getElapsedTime()
    group.current.rotation.y = -0.19 + pointer.x * 0.035 + Math.sin(t * 0.45) * 0.012
    group.current.rotation.x = -0.02 + pointer.y * 0.018
    group.current.rotation.z = 0.035 + Math.sin(t * 0.33) * 0.006
    group.current.position.y = Math.sin(t * 0.55) * 0.04
  })

  return (
    <group ref={group}>
      <Float speed={1.25} rotationIntensity={0.08} floatIntensity={0.16}>
        <RoundedBox args={[3.18, 6.62, 0.34]} radius={0.48} smoothness={28} position={[0, 0, 0]}>
          <meshPhysicalMaterial color="#080807" metalness={0.72} roughness={0.18} clearcoat={1} clearcoatRoughness={0.12} />
        </RoundedBox>
        <RoundedBox args={[3.02, 6.43, 0.16]} radius={0.42} smoothness={28} position={[0, 0, 0.16]}>
          <meshPhysicalMaterial color="#1a1714" metalness={0.55} roughness={0.28} clearcoat={0.7} />
        </RoundedBox>
        <RoundedBox args={[2.82, 6.08, 0.045]} radius={0.34} smoothness={24} position={[0, 0, 0.26]}>
          <meshPhysicalMaterial color="#efe8dd" roughness={0.12} transmission={0.02} transparent opacity={0.96} clearcoat={1} clearcoatRoughness={0.05} />
        </RoundedBox>
        <mesh position={[-1.67, 1.7, 0.02]}>
          <boxGeometry args={[0.06, 0.8, 0.1]} />
          <meshStandardMaterial color="#c7ab7f" metalness={0.78} roughness={0.28} />
        </mesh>
        <mesh position={[1.67, 1.12, 0.02]}>
          <boxGeometry args={[0.06, 1.2, 0.1]} />
          <meshStandardMaterial color="#c7ab7f" metalness={0.78} roughness={0.28} />
        </mesh>
        <mesh position={[-0.28, 2.86, 0.315]}>
          <capsuleGeometry args={[0.13, 0.52, 12, 28]} />
          <meshPhysicalMaterial color="#020202" roughness={0.25} clearcoat={0.7} />
        </mesh>
        <mesh position={[0, 1.42, 0.334]} rotation={[0, 0, -0.08]}>
          <planeGeometry args={[2.45, 3.4]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.11} blending={THREE.AdditiveBlending} />
        </mesh>
      </Float>
    </group>
  )
}

function PhoneScreen({ active, typing, visible }: { active: Workflow; typing: boolean; visible: Workflow }) {
  return (
    <div className="screen-ui">
      <div className="phone-status"><span>9:41</span><span>5G ▰</span></div>
      <div className="phone-header"><b>Stay Automatic</b><small>AI operator online</small></div>
      <div className="chat-feed" key={`${active.label}-${visible.label}-${typing ? 'typing' : 'done'}`}>
        <p className="bubble agent">Show me what AI can actually do for my business.</p>
        <p className="bubble user">{active.prompt}</p>
        {typing ? (
          <div className="typing"><i /><i /><i /></div>
        ) : (
          <>
            <p className="bubble agent">{visible.reply}</p>
            <div className="action-card">
              <span>Workflow completed</span>
              <strong>{visible.actionTitle}</strong>
              <ul>{visible.actions.map((item) => <li key={item}>{item}</li>)}</ul>
            </div>
          </>
        )}
      </div>
      <div className="composer"><span>Ask Stay Automatic…</span><button>↑</button></div>
    </div>
  )
}

function App() {
  const [selected, setSelected] = useState<WorkflowKey>('workspace')
  const [visible, setVisible] = useState<WorkflowKey>('workspace')
  const [typing, setTyping] = useState(false)
  const selectedWorkflow = useMemo(() => workflows[selected], [selected])
  const visibleWorkflow = useMemo(() => workflows[visible], [visible])

  useEffect(() => {
    document.title = 'Stay Automatic — Real AI operator demos'
  }, [])

  function choose(key: WorkflowKey) {
    if (key === selected) return
    setSelected(key)
    setTyping(true)
    window.setTimeout(() => {
      setVisible(key)
      setTyping(false)
    }, 820)
  }

  return (
    <main className="page-shell">
      <div className="backdrop-orb orb-one" />
      <div className="backdrop-orb orb-two" />
      <header className="topbar">
        <a className="brand" href="/"><span>Stay</span> Automatic</a>
        <a className="access" href="mailto:kyle@stayautomatic.com?subject=Show%20me%20the%20real%20power%20of%20AI">Request access</a>
      </header>

      <section className="hero" aria-label="Stay Automatic interactive 3D AI operator demo">
        <div className="copy">
          <p className="kicker">Real workflows. Real tools. Real leverage.</p>
          <h1>Let us show you what AI can actually do.</h1>
          <p className="lede">Not another prompt pack or shiny dashboard. Pick a workflow and watch the operator handle the real steps: calendar, email, docs, social posts, calls, customer folders, approvals, and delivery.</p>
          <div className="cta-row">
            <a className="button primary" href="mailto:kyle@stayautomatic.com?subject=Map%20my%20first%20AI%20workflow">Map my first workflow</a>
            <a className="button ghost" href="mailto:kyle@stayautomatic.com?subject=Preview%20Stay%20Automatic%20workflow%20library">Preview workflow library</a>
          </div>
        </div>

        <section className="render-stage" aria-label="3D phone with live AI operator chat">
          <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 0, 8.2], fov: 35 }} gl={{ antialias: true, alpha: true }}>
            <ambientLight intensity={0.62} />
            <spotLight position={[-3, 4.5, 5.5]} angle={0.5} penumbra={0.9} intensity={4.8} castShadow shadow-mapSize={[1024, 1024]} />
            <pointLight position={[3, -1, 4]} intensity={1.9} color="#90b9ff" />
            <pointLight position={[-3, -2, 3]} intensity={1.25} color="#ffcf91" />
            <Environment preset="city" />
            <PhoneModel />
            <ContactShadows position={[0, -3.55, -0.3]} opacity={0.44} width={6.5} height={2.8} blur={2.7} far={5} />
          </Canvas>
          <div className="screen-portal" aria-hidden="true">
            <PhoneScreen active={selectedWorkflow} typing={typing} visible={visibleWorkflow} />
          </div>
        </section>

        <aside className="control-card" aria-live="polite">
          <p className="label">Live workflow</p>
          <h2>{typing ? 'The operator is working…' : visibleWorkflow.sideTitle}</h2>
          <p>{typing ? 'It is checking the request, choosing the tools, and preparing the next visible action.' : visibleWorkflow.sideCopy}</p>
          <div className="workflow-list" aria-label="Choose workflow demo">
            {order.map((key) => (
              <button key={key} className={selected === key ? 'active' : ''} onClick={() => choose(key)}>
                <span>{workflows[key].label}</span>
                <small>{workflows[key].eyebrow}</small>
              </button>
            ))}
          </div>
        </aside>
      </section>
    </main>
  )
}

export default App
