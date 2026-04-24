import { useEffect, useRef } from 'react'

type ShowcaseCardProps = {
  id: string
  title: string
  summary: string
  detail: string
  image: string
  reverse?: boolean
  href?: string
  meta?: string
}

function ShowcaseCard({ id, title, summary, detail, image, reverse = false, href, meta }: ShowcaseCardProps) {
  const cardRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const card = cardRef.current
    if (!card) return

    const updateFromPoint = (clientX: number, clientY: number) => {
      const rect = card.getBoundingClientRect()
      const px = (clientX - rect.left) / rect.width - 0.5
      const py = (clientY - rect.top) / rect.height - 0.5

      card.style.setProperty('--card-x', `${px.toFixed(4)}`)
      card.style.setProperty('--card-y', `${py.toFixed(4)}`)
    }

    const handleMouseMove = (event: MouseEvent) => updateFromPoint(event.clientX, event.clientY)
    const handleMouseLeave = () => {
      card.style.setProperty('--card-x', '0')
      card.style.setProperty('--card-y', '0')
    }

    card.addEventListener('mousemove', handleMouseMove)
    card.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      card.removeEventListener('mousemove', handleMouseMove)
      card.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  return (
    <article className={`showcase-card${reverse ? ' showcase-card-reverse' : ''}`} ref={cardRef}>
      <div className="showcase-media">
        <div className="showcase-media-inner">
          <img src={image} alt={title} />
        </div>
      </div>
      <div className="showcase-copy">
        <span className="work-id">{id}</span>
        <h3>
          {href ? (
            <a className="showcase-title-link" href={href} target="_blank" rel="noreferrer">
              {title}
            </a>
          ) : (
            title
          )}
        </h3>
        <p>{summary}</p>
        <p className="showcase-detail">{detail}</p>
        {(meta || href) && (
          <div className="showcase-meta-row">
            {meta ? <span className="showcase-meta">{meta}</span> : <span />}
            {href ? (
              <a className="showcase-link" href={href} target="_blank" rel="noreferrer">
                Visit live project
              </a>
            ) : null}
          </div>
        )}
      </div>
    </article>
  )
}

export default ShowcaseCard
