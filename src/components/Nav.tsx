'use client'
import Link from 'next/link'
import TLink from './TLink'
import { WaBtn } from './ui'

export const LINKS: [string, string][] = [['Places', '/places'], ['Gurdwaras', '/places?f=Gurdwaras'], ['Historical sites', '/places?f=Historical sites'], ['Community', '/places?f=Community places'], ['Contact', '/#contact']]

export default function Nav() {
  return (
    <header className="nav">
      <div className="navin">
        <TLink href="/" className="wm" aria-label="Odyssey Travel home">Odyssey<i> Travel</i></TLink>
        <nav className="links" aria-label="Main">
          {LINKS.map(([t, h]) => (h.includes('#') ? <Link key={t} href={h}>{t}</Link> : <TLink key={t} href={h}>{t}</TLink>))}
        </nav>
        <div className="row ctr g8">
          <WaBtn label="WhatsApp" className="navwa" />
          <button className="burger" aria-label="Open menu" aria-haspopup="dialog" onClick={() => document.documentElement.classList.add('menu-open')}><i /><i /></button>
        </div>
      </div>
    </header>
  )
}
