'use client'
import { imgPath } from '@/lib/site'
import { STATS } from '@/lib/places'
import { useTheme } from './ThemeProvider'
import TLink from './TLink'
import { ArrIcon, Ph, Split, WaBtn } from './ui'

const Explore = () => (
  <TLink href="/places" className="btn pri"><ArrIcon /><span className="t">Explore places</span></TLink>
)

/** Theme-dependent hero: v1 collage, v2 floating card, v3 arches. Server-rendered as theme A. */
export default function Hero() {
  const { theme } = useTheme()
  const h1 = imgPath(theme.h1)
  if (theme.hv === 'v2')
    return (
      <section className="hv v2" key="v2"><div className="wrap rel">
        <div className="v2img"><Ph src={h1} alt="Gurdwara Janam Asthan, Nankana Sahib" cls="hero-img r56 rv-s fill" sizes="100vw" priority /></div>
        <div className="floatcard v2card rv">
          <Split as="h1" className="xl2">{theme.title}</Split>
          <p>Gurdwaras, history and community places, with a direct line to us on WhatsApp or email.</p>
          <div className="row g12 wrapx"><Explore /><WaBtn /></div>
        </div>
        <div className="floatcard v2search rv"><span>Place</span><span>City</span><span>Type</span><TLink href="/places" className="btn pri"><span className="t">Search</span></TLink></div>
      </div></section>
    )
  if (theme.hv === 'v3')
    return (
      <section className="hv v3 wrap" key="v3">
        <Split as="h1" className="xl">{theme.title}</Split>
        <p className="lead rv">Gurdwaras, historical sites and community places, with their history and a direct line to us.</p>
        <div className="row g12 wrapx rv" style={{ justifyContent: 'center' }}><Explore /><WaBtn /></div>
        <div className="arches">
          <Ph src="/places/gurdwara-janam-asthan/03.jpg" alt="Gurdwara Janam Asthan courtyard" cls="shp rv-s a1" sizes="26vw" />
          <Ph src={h1} alt="Gurdwara Janam Asthan, Nankana Sahib" cls="hero-img shp rv-s a2" sizes="30vw" priority />
          <Ph src="/places/gurdwara-dera-sahib/04.jpg" alt="Gurdwara Dera Sahib, Lahore" cls="shp rv-s a3" sizes="26vw" />
        </div>
      </section>
    )
  return (
    <section className="hv v1 wrap" key="v1">
      <div className="col g28 txt">
        <Split as="h1" className="xl">{theme.title}</Split>
        <p className="lead rv">Gurdwaras, historical sites and community places, with their history and details. Check a place, then message us on WhatsApp or email.</p>
        <div className="row g16 wrapx rv"><Explore /><WaBtn /></div>
        <div className="row g12 wrapx rv">
          <span className="chipn"><b>{STATS.places}</b> places</span>
          <span className="chipn"><b>{STATS.cities}</b> cities</span>
          <span className="chipn"><b>{STATS.provinces}</b> provinces</span>
        </div>
      </div>
      <div className="coll">
        <div className="bigc float" />
        <Ph src={h1} alt="Gurdwara Janam Asthan, Nankana Sahib" cls="hero-img shp rv-s c-main" sizes="(max-width:1000px) 60vw, 30vw" priority />
        <Ph src="/places/gurdwara-dera-sahib/05.jpg" alt="Gurdwara Dera Sahib, Lahore" cls="rv-s c-circ float2" sizes="18vw" />
        <Ph src="/places/gurdwara-darbar-sahib-kartarpur/06.jpg" alt="Gurdwara Darbar Sahib Kartarpur" cls="rv-s c-small float" sizes="18vw" />
      </div>
    </section>
  )
}
