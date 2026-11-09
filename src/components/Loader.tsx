'use client'
import Image from 'next/image'
import { useEffect, useRef } from 'react'
import { imgPath } from '@/lib/site'
import { useTheme } from './ThemeProvider'

/** Full-screen wallpaper that counts up, then shrinks into the hero (desktop) or lifts like a curtain (mobile). */
export default function Loader() {
  const { theme } = useTheme(), ref = useRef<HTMLDivElement>(null), n = useRef<HTMLElement>(null), bar = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const H = document.documentElement, ld = ref.current
    if (!ld || !H.classList.contains('pre')) { H.classList.remove('pre'); window.dispatchEvent(new Event('od:ready')); return }
    try { sessionStorage.setItem('odLd', '1') } catch {}
    const mob = matchMedia('(max-width:700px)').matches, t0 = performance.now(), D = 2000
    let raf = 0
    const ready = () => window.dispatchEvent(new Event('od:ready'))
    const done = () => { H.classList.remove('pre'); ld.style.display = 'none' }
    const shrink = () => {
      ld.classList.add('shrink')
      const hero = [...document.querySelectorAll<HTMLElement>('.hero-img')].find((e) => e.getBoundingClientRect().width > 0)
      if (mob || !hero) {
        ld.classList.add('curtain')
        setTimeout(() => H.classList.remove('pre'), 500); setTimeout(ready, 800); setTimeout(done, 1300); return
      }
      const r = hero.getBoundingClientRect(), br = getComputedStyle(hero).borderRadius
      requestAnimationFrame(() => Object.assign(ld.style, { left: r.left + 'px', top: r.top + 'px', width: r.width + 'px', height: r.height + 'px', borderRadius: br }))
      setTimeout(() => H.classList.remove('pre'), 650); setTimeout(ready, 1100)
      setTimeout(() => (ld.style.opacity = '0'), 1500); setTimeout(done, 2000)
    }
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / D)
      if (n.current) n.current.textContent = Math.round(p * 100) + '%'
      if (bar.current) bar.current.style.width = p * 100 + '%'
      p < 1 ? (raf = requestAnimationFrame(tick)) : shrink()
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])
  return (
    <div id="ld" ref={ref} aria-hidden="true">
      <div className="ldimg"><Image key={theme.loader} src={imgPath(theme.loader)} alt="" fill priority sizes="100vw" quality={60} /></div>
      <div id="ldb">
        <span className="wm" style={{ fontSize: 40 }}>Odyssey<i> Travel</i></span>
        <p>Loading sacred places</p>
        <div id="ldt"><div id="ldbar" ref={bar} /></div>
        <b ref={n}>0%</b>
      </div>
    </div>
  )
}
