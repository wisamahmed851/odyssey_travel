'use client'
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { THEMES, type Theme, type ThemeKey } from '@/lib/site'

const Ctx = createContext<{ key: ThemeKey; theme: Theme; set: (k: ThemeKey) => void }>({ key: 'A', theme: THEMES.A, set: () => {} })
export const useTheme = () => useContext(Ctx)

export default function ThemeProvider({ children }: { children: ReactNode }) {
  const [key, setKey] = useState<ThemeKey>('A') // server + first client render use A; the head script has already painted the real colours
  useEffect(() => {
    const t = document.documentElement.dataset.theme as ThemeKey
    if (t && THEMES[t] && t !== 'A') setKey(t)
  }, [])
  const set = (k: ThemeKey) => {
    setKey(k)
    const d = document.documentElement
    d.dataset.theme = k
    document.querySelector('meta[name=theme-color]')?.setAttribute('content', THEMES[k].bg)
    try { localStorage.setItem('odTheme', k) } catch {}
    setTimeout(() => window.dispatchEvent(new Event('od:replay')), 30)
  }
  return <Ctx.Provider value={{ key, theme: THEMES[key], set }}>{children}</Ctx.Provider>
}
