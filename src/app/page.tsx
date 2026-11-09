import type { Metadata } from 'next'
import Faq, { type QA } from '@/components/Faq'
import Hero from '@/components/Hero'
import JsonLd from '@/components/JsonLd'
import PlaceCard from '@/components/PlaceCard'
import TLink from '@/components/TLink'
import { ArrIcon, BookIcon, ChatIcon, MailBtn, Ph, SearchIcon, Split, WaBtn } from '@/components/ui'
import { FEATURED, STATS } from '@/lib/places'
import { SITE } from '@/lib/site'

export const metadata: Metadata = {
  title: { absolute: `${SITE.name} | Sikh holy places and heritage in Pakistan` },
  description: `Discover ${STATS.places} Sikh holy places, gurdwaras and historical sites across Pakistan, with their history and location. Message Odyssey Travel on WhatsApp or email to plan your visit.`,
  alternates: { canonical: '/' },
}

const NAMES = ['Janam Asthan', 'Darbar Sahib Kartarpur', 'Dera Sahib', 'Babe-di-Ber', 'Panja Sahib', 'Nankana Sahib', 'Kartarpur', 'Lahore', 'Sialkot', 'Peshawar']
const CATS = [
  { n: 'Gurdwaras', d: 'The shrines of the Gurus', img: '/places/gurdwara-janam-asthan/05.jpg', f: 'Gurdwaras', alt: 'Gurdwara at Nankana Sahib' },
  { n: 'Historical sites', d: 'Frescoes, relics and old walls', img: '/places/gurdwara-babe-di-ber/03.jpg', f: 'Historical sites', alt: 'Historic frescoes at Gurdwara Babe-di-Ber, Sialkot' },
  { n: 'Community places', d: 'Where Sikh families gather', img: '/places/gurdwara-dera-sahib/04.jpg', f: 'Community places', alt: 'Gurdwara Dera Sahib, Lahore' },
]
const STEPS = [
  { i: <SearchIcon />, t: 'Pick a place', d: 'Browse gurdwaras, historical sites and community places.' },
  { i: <BookIcon />, t: 'Read its story', d: 'History, location and what to know before you go.' },
  { i: <ChatIcon />, t: 'Message us', d: 'Contact us on WhatsApp or email to plan your visit.' },
]
const FAQ: QA[] = [
  { q: 'What is Odyssey Travel?', a: `Odyssey Travel is a guide to Sikh holy places in Pakistan. It lists ${STATS.places} gurdwaras, historical sites and community places across ${STATS.provinces} provinces, with their history and location, and lets visitors contact us directly on WhatsApp or email.` },
  { q: 'Which Sikh holy places can I visit in Pakistan?', a: 'Well-known places include Gurdwara Janam Asthan at Nankana Sahib, Gurdwara Darbar Sahib at Kartarpur, Gurdwara Dera Sahib in Lahore, Gurdwara Panja Sahib at Hasan Abdal and Gurdwara Babe-di-Ber in Sialkot.' },
  { q: 'How do I plan a visit?', a: 'Choose a place on the site, read its details, then send us a message on WhatsApp or email with the place and your preferred dates. We reply with the next steps.' },
  { q: 'Where are these places located?', a: `The places are in ${[...new Set(['Punjab', 'Khyber Pakhtunkhwa', 'Sindh'])].join(', ')}. Each page shows the city, province and, where known, map coordinates.` },
]

export default function Home() {
  return (
    <>
      <Hero />
      <div className="mq" aria-hidden="true">
        <div className="mqin">{[...NAMES, ...NAMES].map((n, i) => <span key={i} style={{ display: 'contents' }}><span>{n}</span><i /></span>)}</div>
      </div>

      <section className="sec wrap" aria-labelledby="journey">
        <div className="head"><Split className="" >Choose your journey</Split><p className="lead">Three ways into the Sikh heritage of Pakistan.</p></div>
        <span id="journey" className="sr">Categories</span>
        <div className="cats">
          {CATS.map((c) => (
            <TLink key={c.n} href={`/places?f=${encodeURIComponent(c.f)}`} className="card rv cat">
              <div className="tl2">
                <Ph src={c.img} alt={c.alt} cls="shp" style={{ aspectRatio: '416/500' }} sizes="(max-width:700px) 74vw, 30vw" />
                <div className="row between ctr catrow"><div className="col"><h3>{c.n}</h3><p>{c.d}</p></div><span className="go solid"><ArrIcon /></span></div>
              </div>
            </TLink>
          ))}
        </div>
      </section>

      <section className="sec2">
        <div className="head wrap"><Split>Featured places</Split><span className="hint">Drag to explore <ArrIcon /></span></div>
        <div className="strip wrap">{FEATURED.map((p) => <PlaceCard key={p.slug} p={p} />)}</div>
      </section>

      <section className="sec wrap" aria-label="Site in numbers">
        <div className="cnts">
          {[[STATS.places, 'places listed'], [STATS.cities, 'cities and towns'], [STATS.provinces, 'provinces']].map(([n, l]) => (
            <div key={l} className="col ctr rv cnt"><span className="bignum"><span data-count={n}>{n}</span></span><p>{l}</p></div>
          ))}
        </div>
      </section>

      <section className="sec wrap plan">
        <div className="pcoll">
          <Ph src="/places/gurdwara-janam-asthan/02.jpg" alt="Gurdwara Janam Asthan skyline" cls="rv-s r44 p1 float" sizes="(max-width:1000px) 70vw, 30vw" />
          <Ph src="/places/gurdwara-darbar-sahib-kartarpur/05.jpg" alt="Darbar Sahib Kartarpur" cls="rv-s r44 p2 float2" sizes="(max-width:1000px) 70vw, 30vw" />
          <div className="p3" />
        </div>
        <div className="col g24 ptxt">
          <Split>Plan your visit in three steps</Split>
          {STEPS.map((s) => (
            <div key={s.t} className="row g20 ctr rv"><span className="ico">{s.i}</span><div className="col"><h3 className="h3s">{s.t}</h3><p>{s.d}</p></div></div>
          ))}
          <div className="row g12 wrapx rv"><WaBtn /><MailBtn /></div>
        </div>
      </section>

      <Faq items={FAQ} />

      <section className="cta rel" id="contact">
        <div className="ctac float"><Ph src="/places/gurdwara-dera-sahib/05.jpg" alt="" cls="rcirc" sizes="180px" /></div>
        <Split>Ready to plan your visit?</Split>
        <div className="row g12 wrapx rv"><WaBtn /><MailBtn kind="soft" /></div>
      </section>

      <JsonLd data={{
        '@context': 'https://schema.org', '@type': 'ItemList', name: 'Featured Sikh holy places in Pakistan',
        itemListElement: FEATURED.map((p, i) => ({ '@type': 'ListItem', position: i + 1, url: `${SITE.url}/places/${p.slug}`, name: p.name })),
      }} />
    </>
  )
}
