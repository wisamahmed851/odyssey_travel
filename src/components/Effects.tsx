'use client'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { arrived } from './transition'

const mq = (q: string) => matchMedia(q).matches
const isM = () => mq('(max-width:700px)')
let io: IntersectionObserver | null = null

function count(e: Element) {
  const n = Number(e.getAttribute('data-count')), t0 = performance.now()
  const f = (now: number) => {
    const p = Math.min(1, (now - t0) / 1600)
    e.textContent = String(Math.round(n * (1 - Math.pow(1 - p, 3))))
    if (p < 1) requestAnimationFrame(f)
  }
  requestAnimationFrame(f)
}

/** Reset and (re)observe every reveal target on the page. */
function play() {
  io?.disconnect()
  const reduced = mq('(prefers-reduced-motion:reduce)')
  const targets = [...document.querySelectorAll<HTMLElement>('.rv,.rv-s,.split')]
  targets.forEach((e) => {
    e.classList.remove('in')
    if (!e.classList.contains('split')) {
      const idx = e.parentElement ? [...e.parentElement.children].indexOf(e) : 0
      e.style.transitionDelay = Math.min(idx * (isM() ? 90 : 110), 440) + 'ms'
    }
  })
  if (reduced) { targets.forEach((e) => e.classList.add('in')); return }
  io = new IntersectionObserver((es) => es.forEach((x) => {
    if (x.isIntersecting) { x.target.classList.add('in'); x.target.querySelectorAll('[data-count]').forEach(count); io?.unobserve(x.target) }
  }), { threshold: 0.1, rootMargin: '0px 0px -4% 0px' })
  targets.forEach((e) => io!.observe(e))
  fx()
}

// mobile: image parallax + focus scaling of swipe rows
let raf = false
function fx() {
  raf = false
  if (!isM() || mq('(prefers-reduced-motion:reduce)')) return
  const vh = innerHeight
  document.querySelectorAll<HTMLElement>('.tl .ph img').forEach((im) => {
    const r = im.parentElement!.getBoundingClientRect()
    if (r.bottom < -80 || r.top > vh + 80) return
    im.style.transform = `translate3d(0,${((((r.top + r.height / 2) - vh / 2) / vh) * -30).toFixed(1)}px,0) scale(1.16)`
  })
  document.querySelectorAll<HTMLElement>('.cats,.strip').forEach((c) => {
    const cr = c.getBoundingClientRect()
    if (cr.bottom < 0 || cr.top > vh) return
    const mid = cr.left + cr.width / 2
    for (const it of Array.from(c.children) as HTMLElement[]) {
      const el = it.querySelector<HTMLElement>('.tl,.tl2')
      if (!el) continue
      const r = it.getBoundingClientRect(), d = Math.abs(r.left + r.width / 2 - mid) / cr.width
      el.style.transform = `scale(${(1 - Math.min(0.12, d * 0.22)).toFixed(3)})`
      el.style.opacity = (1 - Math.min(0.4, d * 0.8)).toFixed(2)
    }
  })
}
const qfx = () => { if (!raf) { raf = true; requestAnimationFrame(fx) } }

export default function Effects() {
  const pathname = usePathname()

  // per-route: finish the page transition, then reveal (after the loader on first paint)
  useEffect(() => {
    arrived()
    window.scrollTo(0, 0)
    const start = () => requestAnimationFrame(play)
    if (document.documentElement.classList.contains('pre')) { window.addEventListener('od:ready', start, { once: true }); return () => window.removeEventListener('od:ready', start) }
    start()
  }, [pathname])

  // one-time global behaviours
  useEffect(() => {
    const R = mq('(prefers-reduced-motion:reduce)'), touch = mq('(hover:none)')
    const H = document.documentElement
    const on = <K extends keyof DocumentEventMap>(t: K, f: (e: DocumentEventMap[K]) => void, o?: AddEventListenerOptions) => { document.addEventListener(t, f as EventListener, o); return () => document.removeEventListener(t, f as EventListener) }
    const off: (() => void)[] = []
    const replay = () => requestAnimationFrame(play)
    window.addEventListener('od:replay', replay); off.push(() => window.removeEventListener('od:replay', replay))

    // mobile accordion for history chapters
    off.push(on('click', (e) => {
      const ch = (e.target as Element).closest('.chap')
      if (ch && isM()) { if (!ch.classList.contains('open')) try { navigator.vibrate?.(8) } catch {} ch.classList.toggle('open') }
    }))
    // tap ripple
    off.push(on('pointerdown', (e) => {
      const b = (e.target as Element).closest<HTMLElement>('.btn,.pill')
      if (!b || R) return
      const r = b.getBoundingClientRect(), s = Math.max(r.width, r.height) * 2.2, d = document.createElement('span')
      d.className = 'rip'
      d.style.cssText = `width:${s}px;height:${s}px;left:${e.clientX - r.left - s / 2}px;top:${e.clientY - r.top - s / 2}px`
      b.appendChild(d); setTimeout(() => d.remove(), 700)
    }))
    // scroll: nav shrink, progress bar, mobile fx
    let tk = false
    const sc = () => {
      if (tk) return; tk = true
      requestAnimationFrame(() => {
        tk = false
        const y = scrollY, mx = H.scrollHeight - innerHeight
        document.querySelectorAll<HTMLElement>('.nav').forEach((n) => (n.style.paddingTop = y > 30 && !isM() ? '8px' : ''))
        const p = document.getElementById('prog'); if (p) p.style.transform = `scaleX(${mx > 0 ? Math.min(1, y / mx) : 0})`
        fx()
      })
    }
    addEventListener('scroll', sc, { passive: true }); off.push(() => removeEventListener('scroll', sc))
    const horiz = (e: Event) => { if ((e.target as Element).matches?.('.cats,.strip')) qfx() }
    document.addEventListener('scroll', horiz, { capture: true, passive: true }); off.push(() => document.removeEventListener('scroll', horiz, true))
    const mm = matchMedia('(max-width:700px)'), reset = () => { document.querySelectorAll<HTMLElement>('.tl .ph img,.cats .tl2,.strip .tl').forEach((e) => { e.style.transform = ''; e.style.opacity = '' }); qfx() }
    mm.addEventListener('change', reset); off.push(() => mm.removeEventListener('change', reset))

    // drag-to-scroll strips (mouse)
    let drag: { s: HTMLElement; x: number; l: number } | null = null
    off.push(on('mousedown', (e) => { const s = (e.target as Element).closest<HTMLElement>('.strip'); if (s) { drag = { s, x: e.pageX, l: s.scrollLeft }; s.classList.add('drag') } }))
    off.push(on('mousemove', (e) => { if (!drag) return; if (Math.abs(e.pageX - drag.x) > 5) drag.s.classList.add('moved'); drag.s.scrollLeft = drag.l - (e.pageX - drag.x) }))
    off.push(on('mouseup', () => { if (!drag) return; const s = drag.s; drag = null; s.classList.remove('drag'); setTimeout(() => s.classList.remove('moved'), 60) }))
    off.push(on('click', (e) => { if ((e.target as Element).closest('.strip.moved')) { e.preventDefault(); e.stopPropagation() } }, { capture: true }))

    // pointer effects (mouse only): custom cursor, card tilt, magnetic buttons
    if (!touch && !R) {
      const c = document.getElementById('cur')
      let cx = 0, cy = 0, tx = 0, ty = 0, alive = true
      if (c) {
        const loop = () => { if (!alive) return; cx += (tx - cx) * 0.2; cy += (ty - cy) * 0.2; c.style.transform = `translate(${cx - 9}px,${cy - 9}px)`; requestAnimationFrame(loop) }
        loop(); off.push(() => { alive = false })
      }
      off.push(on('mousemove', (e) => {
        tx = e.clientX; ty = e.clientY; c?.classList.add('on')
        const t = e.target as Element
        const k = t.closest('.card')
        if (k && !isM()) {
          const tl = k.querySelector<HTMLElement>('.tl')
          if (tl) { const r = tl.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5; tl.style.transform = `perspective(900px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-8px)` }
        }
        const b = t.closest<HTMLElement>('.btn')
        if (b) { const r = b.getBoundingClientRect(); b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.22}px,${(e.clientY - r.top - r.height / 2) * 0.3}px)` }
      }))
      off.push(on('mouseover', (e) => { const k = (e.target as Element).closest('.card'); if (!c) return; c.classList.toggle('big', !!k); c.textContent = k ? 'View' : '' }))
      off.push(on('mouseout', (e) => {
        const t = e.target as Element, rel = e.relatedTarget as Node | null
        const k = t.closest('.card'); if (k && !k.contains(rel)) { const tl = k.querySelector<HTMLElement>('.tl'); if (tl) tl.style.transform = '' }
        const b = t.closest<HTMLElement>('.btn'); if (b && !b.contains(rel)) b.style.transform = ''
      }))
    }
    return () => off.forEach((f) => f())
  }, [])
  return null
}
