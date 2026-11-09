'use client'
import Link from 'next/link'
import { useEffect } from 'react'
import TLink from './TLink'
import { LINKS } from './Nav'

const close = () => document.documentElement.classList.remove('menu-open')
export default function Menu() {
  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === 'Escape' && close()
    addEventListener('keydown', k)
    return () => removeEventListener('keydown', k)
  }, [])
  const all: [string, string][] = [['Home', '/'], ['Places', '/places'], ...LINKS.slice(1)]
  return (
    <div id="menu" role="dialog" aria-label="Menu">
      <button className="mclose" aria-label="Close menu" onClick={close}>&#10005;</button>
      <nav className="mwrap">
        {all.map(([t, h], i) =>
          h.includes('#') ? <Link key={t} href={h} style={{ '--i': i } as React.CSSProperties} onClick={close}>{t}</Link>
            : <TLink key={t} href={h} style={{ '--i': i } as React.CSSProperties} onClick={close}>{t}</TLink>)}
      </nav>
    </div>
  )
}
