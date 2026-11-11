import Link from 'next/link'
import { SITE } from '@/lib/site'

const LINKS: [string, string][] = [['Home', '/'], ['All places', '/places'], ['Gurdwaras', '/places?f=Gurdwaras'], ['Historical sites', '/places?f=Historical sites'], ['Community places', '/places?f=Community places']]

export default function Footer() {
  return (
    <footer className="foot wrap">
      <div className="col g8">
        <Link href="/" className="hd" style={{ fontSize: 28 }}>Odyssey Travel</Link>
        <span>{SITE.tagline}</span>
      </div>
      <nav aria-label="Footer" className="row g16 wrapx">{LINKS.map(([t, h]) => <Link key={t} href={h}>{t}</Link>)}</nav>
      <span>WhatsApp and email contact</span>
    </footer>
  )
}
