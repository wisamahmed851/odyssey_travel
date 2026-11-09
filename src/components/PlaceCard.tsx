import type { CSSProperties } from 'react'
import { cover, initial, type Place } from '@/lib/places'
import TLink from './TLink'
import { ArrIcon, Ph } from './ui'

export default function PlaceCard({ p, ar = '440/560', shp = false, i = 0, priority = false }: { p: Place; ar?: string; shp?: boolean; i?: number; priority?: boolean }) {
  const c = cover(p)
  const style: CSSProperties = { aspectRatio: ar }
  if (!c) style.background = `var(--${i % 2 === 0 ? 'soft' : 'ac2'})`
  return (
    <TLink href={`/places/${p.slug}`} className="card rv" aria-label={`${p.name}, ${p.city}`}>
      <div className={`tl ${shp ? 'shp' : ''}`} style={style}>
        {c ? (
          <Ph src={c.src} alt={`${p.name} in ${p.city}, ${p.province}`} cls="fill" sizes="(max-width:700px) 90vw, (max-width:1000px) 45vw, 32vw" priority={priority} />
        ) : (
          <div className="initial" aria-hidden="true"><span>{initial(p.name)}</span></div>
        )}
        <div className="cap">
          <div className="col"><b>{p.name}</b><span>{p.city}, {p.province}</span></div>
          <span className="go"><ArrIcon /></span>
        </div>
      </div>
    </TLink>
  )
}
