'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import type { ComponentProps, MouseEvent } from 'react'
import { navigate } from './transition'

/** Next Link with the animated page transition. Falls back to a normal link for modified clicks. */
export default function TLink({ href, onClick, ...rest }: ComponentProps<typeof Link>) {
  const router = useRouter(), path = usePathname()
  const h = String(href)
  return (
    <Link
      href={href}
      {...rest}
      onClick={(e: MouseEvent<HTMLAnchorElement>) => {
        onClick?.(e)
        if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0 || h.includes('#')) return
        e.preventDefault()
        if (h === path) return window.scrollTo({ top: 0, behavior: 'smooth' })
        navigate(router, h)
      }}
    />
  )
}
