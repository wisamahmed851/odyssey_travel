'use client'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { FILTERS, PLACES, matches } from '@/lib/places'
import PlaceCard from './PlaceCard'
import { ArrIcon } from './ui'

const AR_IMG = ['432/520', '432/380', '432/520', '432/440']
const AR_TILE = ['432/340', '432/360', '432/320', '432/420', '432/300']

export default function PlacesBrowser() {
  const params = useSearchParams()
  const pf = params.get('f')
  const [f, setF] = useState(pf && FILTERS.includes(pf) ? pf : 'All')
  const [q, setQ] = useState('')
  useEffect(() => { setF(pf && FILTERS.includes(pf) ? pf : 'All') }, [pf])
  useEffect(() => {
    const t = setTimeout(() => window.dispatchEvent(new Event('od:replay')), 20)
    return () => clearTimeout(t)
  }, [f, q])
  const list = PLACES.filter((p) => matches(p, f, q))
  let a = 0
  let b = 0
  return (
    <>
      <section className="wrap" style={{ paddingTop: 12 }}>
        <form className="row g12 wrapx rv" role="search" style={{ paddingTop: 16 }} onSubmit={(e) => e.preventDefault()}>
          <label className="search">
            <span className="sr">Search a gurdwara or city</span>
            <input type="search" placeholder="Search a gurdwara or city" value={q} onChange={(e) => setQ(e.target.value)} />
          </label>
          <button type="submit" className="btn pri"><ArrIcon /><span className="t">Search</span></button>
        </form>
        <div className="pills rv" role="group" aria-label="Filter places">
          {FILTERS.map((x) => (
            <button key={x} type="button" className={`pill${x === f ? ' on' : ''}`} aria-pressed={x === f} onClick={() => setF(x)}>{x}</button>
          ))}
        </div>
      </section>
      <section className="sec wrap" aria-live="polite">
        {list.length === 0 ? (
          <p className="empty lead">No places match your search. Try another city or clear the filter.</p>
        ) : (
          <div className="masonry">
            {list.map((p, i) => {
              const img = p.images.length > 0
              return <PlaceCard key={p.slug} p={p} i={i} shp={img ? i % 4 === 0 : i % 5 === 3} ar={img ? AR_IMG[a++ % 4] : AR_TILE[b++ % 5]} priority={i < 2} />
            })}
          </div>
        )}
      </section>
    </>
  )
}
