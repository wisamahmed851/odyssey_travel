import Link from 'next/link'
import { SITE } from '@/lib/site'

export default function Footer() {
  return (
    <footer className="foot wrap">
      <Link href="/" className="hd" style={{ fontSize: 28 }}>Odyssey Travel</Link>
      <span>{SITE.tagline}</span>
      <span>WhatsApp and email contact</span>
    </footer>
  )
}
