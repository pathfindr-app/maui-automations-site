import { useEffect, useRef } from 'react'

const assetPath = (path: string) => `${import.meta.env.BASE_URL}${path}`

function HeroVisual() {
  const frameRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const frame = frameRef.current
    if (!frame) return

    const updateFromPoint = (clientX: number, clientY: number) => {
      const rect = frame.getBoundingClientRect()
      const px = (clientX - rect.left) / rect.width - 0.5
      const py = (clientY - rect.top) / rect.height - 0.5

      frame.style.setProperty('--pointer-x', `${px.toFixed(4)}`)
      frame.style.setProperty('--pointer-y', `${py.toFixed(4)}`)
    }

    const updateScroll = () => {
      const rect = frame.getBoundingClientRect()
      const progress = Math.max(-1, Math.min(1, (window.innerHeight * 0.5 - rect.top) / window.innerHeight))
      frame.style.setProperty('--scroll-shift', progress.toFixed(4))
    }

    const handleMouseMove = (event: MouseEvent) => updateFromPoint(event.clientX, event.clientY)
    const handleMouseLeave = () => {
      frame.style.setProperty('--pointer-x', '0')
      frame.style.setProperty('--pointer-y', '0')
    }

    frame.addEventListener('mousemove', handleMouseMove)
    frame.addEventListener('mouseleave', handleMouseLeave)
    window.addEventListener('scroll', updateScroll, { passive: true })
    updateScroll()

    return () => {
      frame.removeEventListener('mousemove', handleMouseMove)
      frame.removeEventListener('mouseleave', handleMouseLeave)
      window.removeEventListener('scroll', updateScroll)
    }
  }, [])

  return (
    <section className="hero-visual" aria-label="Illustrated automation scene">
      <div className="visual-overlay-grid" />
      <div className="hero-stat hero-stat-top">
        <span className="stat-number">01</span>
        <span className="stat-label">Intro</span>
      </div>
      <div className="hero-orbit">
        <div className="orbit-line orbit-line-a" />
        <div className="orbit-line orbit-line-b" />
        <div className="badge badge-impact">Practical systems. Real impact.</div>
        <div className="badge badge-location">Language → tools → finished work</div>
        <div className="badge badge-side">Built small. Designed to scale.</div>
      </div>
      <div className="signal-column">
        <span />
        <span />
        <span />
      </div>

      <div className="crt-stage" ref={frameRef}>
        <div className="crt-depth-layer crt-depth-back" />
        <div className="crt-depth-layer crt-depth-mid" />
        <div className="crt-frame">
          <img src={assetPath('hero-robot-v4.png')} alt="Friendly service robot representing automated business workflows" className="hero-image" />
          <div className="crt-glow" />
          <div className="crt-scanlines" />
          <div className="crt-rgb-split" />
          <div className="crt-noise" />
          <div className="crt-vignette" />
        </div>
      </div>
    </section>
  )
}

export default HeroVisual
