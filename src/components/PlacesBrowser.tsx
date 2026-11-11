'use client'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { FILTERS, PLACES, matches } from '@/lib/places'
import PlacesGrid from './PlacesGrid'
import { ArrIcon } from './ui'

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
          <PlacesGrid list={list} />
        )}
      </section>
    </>
  )
}
