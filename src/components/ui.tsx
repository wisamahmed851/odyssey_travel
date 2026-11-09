import Image from 'next/image'
import type { CSSProperties, ReactNode } from 'react'
import { mailLink, waLink } from '@/lib/site'

const Ic = ({ d, s = 22 }: { d: ReactNode; s?: number }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{d}</svg>
)
export const WaIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2zm5.2 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.3-.7-2.8-1.2-4.6-4-4.7-4.2-.1-.2-1.1-1.5-1.1-2.8s.7-2 1-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.4 0 .5l-.4.6-.4.4c-.1.2-.3.3-.1.6.2.3.8 1.3 1.8 2.1 1.2 1 2.2 1.4 2.5 1.5.3.1.5.1.6-.1l.8-1c.2-.3.4-.2.6-.1l1.9.9c.3.1.5.2.5.3.1.2.1.8-.1 1.4z" /></svg>
)
export const MailIcon = () => <Ic s={20} d={<><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></>} />
export const PinIcon = () => <Ic s={18} d={<><path d="M12 22s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12z" /><circle cx="12" cy="10" r="2.5" /></>} />
export const ArrIcon = () => <Ic s={20} d={<path d="M5 12h14M13 6l6 6-6 6" />} />
export const SearchIcon = () => <Ic s={28} d={<><circle cx="11" cy="11" r="7" /><path d="M20 20l-4-4" /></>} />
export const BookIcon = () => <Ic s={28} d={<path d="M4 5h6a3 3 0 0 1 3 3v11a2 2 0 0 0-2-2H4zM20 5h-6a3 3 0 0 0-3 3v11a2 2 0 0 1 2-2h7z" />} />
export const ChatIcon = () => <Ic s={28} d={<path d="M21 12a8 8 0 0 1-12 6.9L3 20l1.2-5A8 8 0 1 1 21 12z" />} />

export function WaBtn({ label = 'WhatsApp us', text, className = '' }: { label?: string; text?: string; className?: string }) {
  return <a className={`btn wa ${className}`} href={waLink(text)} target="_blank" rel="noopener noreferrer"><WaIcon /><span className="t">{label}</span></a>
}
export function MailBtn({ label = 'Email us', kind = 'soft', subject }: { label?: string; kind?: string; subject?: string }) {
  return <a className={`btn ${kind}`} href={mailLink(subject)}><MailIcon /><span className="t">{label}</span></a>
}

/** Image in a clipped frame. The frame needs its own size (aspect-ratio, .fill or absolute box). */
export function Ph({ src, alt, cls = '', style, sizes = '(max-width:700px) 90vw, 40vw', priority = false, q = 75 }: { src: string; alt: string; cls?: string; style?: CSSProperties; sizes?: string; priority?: boolean; q?: 60 | 75 }) {
  return (
    <div className={`ph ${cls}`} style={style}>
      <Image src={src} alt={alt} fill sizes={sizes} priority={priority} quality={q} />
    </div>
  )
}

/** Headline whose words rise into view (server-rendered, animated by CSS once Effects adds .in). */
export function Split({ as: Tag = 'h2', className = '', children }: { as?: 'h1' | 'h2'; className?: string; children: string }) {
  return (
    <Tag className={`split ${className}`}>
      {children.split(/\s+/).map((w, i) => (
        <span key={i}><span className="w"><span style={{ transitionDelay: `${i * 80}ms` }}>{w}</span></span>{' '}</span>
      ))}
    </Tag>
  )
}
