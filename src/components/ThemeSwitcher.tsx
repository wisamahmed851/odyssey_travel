'use client'
import { useState } from 'react'
import { THEMES, THEME_KEYS } from '@/lib/site'
import { useTheme } from './ThemeProvider'

export default function ThemeSwitcher() {
  const { key, set } = useTheme(), [open, setOpen] = useState(false)
  return (
    <div id="tsw" className={open ? 'open' : ''}>
      <button className="tbtn" aria-label="Preview theme" aria-expanded={open} onClick={() => setOpen(!open)}>Theme <b>{key}</b></button>
      <div className="topts">
        {THEME_KEYS.map((k) => (
          <button key={k} style={{ background: THEMES[k].ac, color: THEMES[k].onac }} title={THEMES[k].name} aria-label={`${THEMES[k].name} theme`} onClick={() => { set(k); setOpen(false) }}>{k}</button>
        ))}
      </div>
    </div>
  )
}
