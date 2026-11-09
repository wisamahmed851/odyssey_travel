// Page transitions: desktop = colour wipe, mobile = horizontal push. Reduced motion = instant.
type R = { push: (h: string) => void }
let mode: 'wipe' | 'push' | null = null
let busy = false
const reduced = () => matchMedia('(prefers-reduced-motion:reduce)').matches
const mobile = () => matchMedia('(max-width:700px)').matches

export function navigate(router: R, href: string) {
  if (busy) return
  if (reduced()) return router.push(href)
  busy = true
  const pg = document.querySelector('.pg')
  document.documentElement.classList.remove('menu-open')
  if (mobile()) {
    pg?.classList.add('pout')
    setTimeout(() => { mode = 'push'; router.push(href) }, 260)
  } else {
    const w = document.getElementById('wipe')
    if (w) { w.style.transition = 'transform .55s cubic-bezier(.77,0,.18,1)'; w.style.transform = 'translateY(0)' }
    setTimeout(() => { mode = 'wipe'; router.push(href) }, 600)
  }
  setTimeout(arrived, 4000) // safety net if navigation stalls
}

export function arrived() {
  const pg = document.querySelector('.pg')
  if (mode === 'wipe') {
    const w = document.getElementById('wipe')
    if (w) {
      w.style.transform = 'translateY(-101%)'
      setTimeout(() => { w.style.transition = 'none'; w.style.transform = 'translateY(101%)' }, 650)
    }
  } else if (mode === 'push' || pg?.classList.contains('pout')) {
    pg?.classList.remove('pout'); pg?.classList.add('pin')
    setTimeout(() => pg?.classList.remove('pin'), 520)
  }
  mode = null; busy = false
}
