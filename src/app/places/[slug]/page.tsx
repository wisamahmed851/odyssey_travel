import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Faq, { type QA } from '@/components/Faq'
import JsonLd from '@/components/JsonLd'
import PlaceCard from '@/components/PlaceCard'
import { MailBtn, PinIcon, Ph, Split, WaBtn } from '@/components/ui'
import { PLACES, cover, getPlace, initial, noIndex, type Place } from '@/lib/places'
import { SITE } from '@/lib/site'

type Props = { params: Promise<{ slug: string }> }
export const dynamicParams = false
export const generateStaticParams = () => PLACES.map((p) => ({ slug: p.slug }))

const blurb = (p: Place) => p.summary || `${p.name} is a Sikh place of interest in ${p.city}, ${p.province}, Pakistan.`

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = getPlace((await params).slug)
  if (!p) return {}
  const c = cover(p)
  const desc = (p.summary ? p.summary.slice(0, 150).replace(/\s+\S*$/, '') + '…' : `${p.name} in ${p.city}, ${p.province}, Pakistan. Details and how to plan a visit with Odyssey Travel.`)
  return {
    title: `${p.name}, ${p.city}`,
    description: desc,
    alternates: { canonical: `/places/${p.slug}` },
    robots: noIndex(p) ? { index: false, follow: true } : undefined, // thin pages stay out of search until they have real details
    openGraph: { type: 'article', title: `${p.name}, ${p.city}`, description: desc, url: `/places/${p.slug}`, images: c ? [{ url: c.src, width: c.w, height: c.h, alt: c.alt }] : undefined },
  }
}

export default async function PlacePage({ params }: Props) {
  const p = getPlace((await params).slug)
  if (!p) notFound()
  const c = cover(p), rest = p.images.filter((i) => i !== c), url = `${SITE.url}/places/${p.slug}`
  const more = PLACES.filter((x) => x.slug !== p.slug && x.images.length > 0).sort((a, b) => Number(b.province === p.province) - Number(a.province === p.province)).slice(0, 3)
  const faq: QA[] = [
    { q: `Where is ${p.name}?`, a: `${p.name} is in ${p.area && p.area !== p.city ? p.area + ', ' : ''}${p.city}, ${p.province}, Pakistan.${p.coords ? ` Its coordinates are ${p.coords.lat}, ${p.coords.lng}.` : ''}` },
    ...(p.rich ? [{ q: `What is ${p.name}?`, a: blurb(p) }] : []),
    { q: `How can I plan a visit to ${p.name}?`, a: `Send Odyssey Travel a message on WhatsApp or email with the place name and your preferred dates, and we will reply with the next steps.` },
  ]
  return (
    <article>
      <section className="wrap rel dhero">
        <nav className="crumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span><Link href="/places">Places</Link><span>/</span><span aria-current="page">{p.name}</span></nav>
        <div className="dimg" style={{ marginTop: 12 }}>
          {c ? <Ph src={c.src} alt={c.alt || p.name} cls="hero-img r56 rv-s fill" sizes="100vw" priority />
             : <div className="ph r56 fill" style={{ background: 'var(--soft)' }}><div className="initial" aria-hidden="true"><span>{initial(p.name)}</span></div></div>}
        </div>
        <div className="floatcard dcard rv">
          <span className="row g8 ctr small"><PinIcon /> {p.city}, {p.province}, Pakistan</span>
          <h1 className="xl3">{p.name}</h1>
          <div className="row g12 wrapx"><WaBtn label="Message on WhatsApp" text={`Hello Odyssey Travel, I would like to visit ${p.name}.`} /><MailBtn label="Send an email" subject={`Visit enquiry: ${p.name}`} /></div>
        </div>
      </section>

      <section className="wrap dgrid">
        <div className="col g24">
          <p className="lead rv big">{blurb(p)}</p>
          {p.history.map((h, i) => (
            <div key={h.heading} className={`chap rv${i === 0 ? ' open' : ''}`}><h2 className="h3s">{h.heading}</h2><p>{h.text}</p></div>
          ))}
          {!p.rich && <p className="rv">We are still collecting the history and photographs for this place. Message us and we will share what we know and help you plan the visit.</p>}
        </div>
        <aside className="dside rv">
          <div className="contact col g16">
            <h2 className="h3s">Plan your visit</h2>
            <p>Ask us about the visit. We reply on WhatsApp or by email.</p>
            <WaBtn label="Message on WhatsApp" text={`Hello Odyssey Travel, I would like to visit ${p.name}.`} />
            <MailBtn label="Send an email" subject={`Visit enquiry: ${p.name}`} />
          </div>
          <div className="mapbox">
            <svg width="100%" viewBox="0 0 400 170" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><circle cx="90" cy="150" r="120" fill="var(--ac2)" opacity=".6" /><circle cx="320" cy="30" r="80" fill="var(--ac2)" opacity=".4" /><g transform="translate(184 46)" stroke="var(--ink)" fill="var(--ac)" strokeWidth="3"><path d="M16 78S32 56 32 38a16 16 0 1 0-32 0c0 18 16 40 16 40z" /><circle cx="16" cy="38" r="6" fill="var(--bg)" /></g></svg>
            <div className="col" style={{ padding: '18px 22px' }}>
              <b>{p.city}, {p.province}</b>
              {p.coords ? <a href={`https://www.google.com/maps?q=${p.coords.lat},${p.coords.lng}`} target="_blank" rel="noopener noreferrer">{p.coords.lat}, {p.coords.lng} · Open map</a> : <span>{p.area}</span>}
            </div>
          </div>
        </aside>
      </section>

      {rest.length > 0 && (
        <section className="sec wrap">
          <Split>Gallery</Split>
          {rest.length >= 3 ? (
            <div className="gal">
              <Ph src={rest[0].src} alt={rest[0].alt} cls="rv-s r44 g1" sizes="(max-width:700px) 80vw, 36vw" />
              <Ph src={rest[1].src} alt={rest[1].alt} cls="rv-s rcirc g2 float" sizes="(max-width:700px) 80vw, 22vw" />
              <Ph src={rest[2].src} alt={rest[2].alt} cls="rv-s r44 g3" sizes="(max-width:700px) 80vw, 32vw" />
            </div>
          ) : (
            <div className="gal" style={{ gridTemplateColumns: `repeat(${rest.length},1fr)` }}>
              {rest.map((i) => <Ph key={i.src} src={i.src} alt={i.alt} cls="rv-s r44" style={{ aspectRatio: '4/3' }} sizes="(max-width:700px) 80vw, 45vw" />)}
            </div>
          )}
          <p className="credit">Photos: {[...new Map(p.images.map((i) => [i.page, i])).values()].map((i, k) => <span key={i.page}>{k > 0 && ', '}<a href={i.page} target="_blank" rel="noopener noreferrer">{i.author || 'Wikimedia Commons'}{i.license ? ` (${i.license})` : ''}</a></span>)}</p>
        </section>
      )}

      <Faq items={faq} title={`About ${p.name}`} />

      <section className="sec wrap">
        <Split>More places</Split>
        <div className="strip nopad" style={{ marginTop: 32 }}>{more.map((m) => <PlaceCard key={m.slug} p={m} />)}</div>
      </section>

      <JsonLd data={{
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': ['TouristAttraction', 'PlaceOfWorship'], '@id': `${url}#place`, name: p.name, description: blurb(p), url,
            address: { '@type': 'PostalAddress', addressLocality: p.city, addressRegion: p.province, addressCountry: 'PK' },
            ...(p.coords ? { geo: { '@type': 'GeoCoordinates', latitude: p.coords.lat, longitude: p.coords.lng } } : {}),
            ...(p.images.length ? { image: p.images.map((i) => `${SITE.url}${i.src}`) } : {}),
            ...(p.wiki ? { sameAs: [p.wiki] } : {}),
          },
          { '@type': 'BreadcrumbList', itemListElement: [['Home', SITE.url], ['Places', `${SITE.url}/places`], [p.name, url]].map(([name, item], i) => ({ '@type': 'ListItem', position: i + 1, name, item })) },
        ],
      }} />
    </article>
  )
}
