# Odyssey Travel (Next.js)

Next.js 16 App Router, TypeScript, static generation. Same five themes (A Saffron, B Marble, C Fields, D Sky, E Orange) as `design/odyssey.html`, switched with the Theme button (`?theme=C` also works).

```bash
npm install
cp .env.example .env.local   # set site URL, WhatsApp number, email
npm run dev                  # http://localhost:3000
npm run build && npm start
npm run data                 # rebuild src/data/places.json + public/places from data/ and scraper/
```

- Routes: `/`, `/places` (filter + search), `/places/[slug]` (one static page per place).
- Places without scraped details are `noindex` and left out of `sitemap.xml` until they have content.
- SEO/GEO/AEO: metadata + canonical + Open Graph, JSON-LD (WebSite, TravelAgency, ItemList, TouristAttraction, BreadcrumbList, FAQPage), `sitemap.xml`, `robots.txt`, `llms.txt`, manifest.
- Performance: static HTML, `next/image` (AVIF/WebP, responsive sizes, priority only on LCP images), self-hosted fonts (only theme A fonts preloaded), immutable cache headers on photos, no animation libraries (CSS + one small effects component).
- `python scripts/audit.py` checks a running build (titles, descriptions, h1, canonical, Open Graph, JSON-LD, thin pages).
