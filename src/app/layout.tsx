import type { Metadata, Viewport } from 'next'
import { DM_Sans, Fraunces, Inter, Manrope, Playfair_Display, Plus_Jakarta_Sans, Poppins } from 'next/font/google'
import Effects from '@/components/Effects'
import Footer from '@/components/Footer'
import JsonLd from '@/components/JsonLd'
import Loader from '@/components/Loader'
import Menu from '@/components/Menu'
import Nav from '@/components/Nav'
import ThemeProvider from '@/components/ThemeProvider'
import ThemeSwitcher from '@/components/ThemeSwitcher'
import { SITE } from '@/lib/site'
import './themes.css'
import './globals.css'

// Theme A fonts are preloaded; the other themes' fonts download only when that theme is chosen.
const inter = Inter({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--f-inter', display: 'swap' })
const poppins = Poppins({ subsets: ['latin'], weight: ['600', '700'], variable: '--f-poppins', display: 'swap' })
const playfair = Playfair_Display({ subsets: ['latin'], weight: ['500', '600'], variable: '--f-playfair', display: 'swap', preload: false })
const fraunces = Fraunces({ subsets: ['latin'], variable: '--f-fraunces', display: 'swap', preload: false })
const manrope = Manrope({ subsets: ['latin'], variable: '--f-manrope', display: 'swap', preload: false })
const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--f-jakarta', display: 'swap', preload: false })
const dmsans = DM_Sans({ subsets: ['latin'], variable: '--f-dmsans', display: 'swap', preload: false })

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: `${SITE.name} | Sikh holy places and heritage in Pakistan`, template: `%s | ${SITE.name}` },
  description: SITE.description,
  applicationName: SITE.name,
  alternates: { canonical: '/' },
  openGraph: { type: 'website', siteName: SITE.name, locale: 'en', url: '/', title: `${SITE.name} | Sikh holy places and heritage in Pakistan`, description: SITE.description, images: [{ url: '/og.jpg', width: 1200, height: 630, alt: 'Gurdwara Janam Asthan, Nankana Sahib' }] },
  twitter: { card: 'summary_large_image', title: SITE.name, description: SITE.description, images: ['/og.jpg'] },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 } },
  formatDetection: { telephone: false },
}
export const viewport: Viewport = { width: 'device-width', initialScale: 1, viewportFit: 'cover', themeColor: '#FFFFFF' }

// Runs before first paint: picks the saved/URL theme, enables the animation layer, decides whether to show the loader.
const boot = `(function(){try{var d=document.documentElement,p=new URLSearchParams(location.search).get('theme'),t=(p||localStorage.getItem('odTheme')||'A').toUpperCase();if(!/^[A-E]$/.test(t))t='A';d.dataset.theme=t;d.classList.add('js');if(!matchMedia('(prefers-reduced-motion:reduce)').matches&&!sessionStorage.getItem('odLd'))d.classList.add('pre')}catch(e){}})()`

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const fonts = [inter, poppins, playfair, fraunces, manrope, jakarta, dmsans].map((f) => f.variable).join(' ')
  return (
    <html lang="en" data-theme="A" className={fonts} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: boot }} />
        <JsonLd data={{
          '@context': 'https://schema.org',
          '@graph': [
            { '@type': 'WebSite', '@id': `${SITE.url}/#website`, url: SITE.url, name: SITE.name, description: SITE.description, inLanguage: 'en', publisher: { '@id': `${SITE.url}/#org` } },
            { '@type': 'TravelAgency', '@id': `${SITE.url}/#org`, name: SITE.name, url: SITE.url, description: SITE.tagline, logo: `${SITE.url}/icon.svg`, image: `${SITE.url}/og.jpg`, areaServed: { '@type': 'Country', name: 'Pakistan' }, knowsAbout: ['Sikh holy places', 'Gurdwaras in Pakistan', 'Sikh heritage tourism'], ...(SITE.email ? { email: SITE.email } : {}) },
          ],
        }} />
      </head>
      <body>
        <a href="#main" className="skip">Skip to content</a>
        <div id="wipe" aria-hidden="true" />
        <div id="cur" aria-hidden="true" />
        <div id="prog" aria-hidden="true" />
        <ThemeProvider>
          <Loader />
          <Menu />
          <div className="pg">
            <Nav />
            <main id="main">{children}</main>
            <Footer />
          </div>
          <ThemeSwitcher />
          <Effects />
        </ThemeProvider>
      </body>
    </html>
  )
}
