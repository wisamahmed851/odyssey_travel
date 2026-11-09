import type { Metadata } from 'next'
import { Suspense } from 'react'
import JsonLd from '@/components/JsonLd'
import PlacesBrowser from '@/components/PlacesBrowser'
import { Split } from '@/components/ui'
import { PLACES } from '@/lib/places'
import { SITE } from '@/lib/site'

export const metadata: Metadata = {
  title: 'All Sikh holy places in Pakistan',
  description: `Browse ${PLACES.length} gurdwaras, historical sites and Sikh community places across Punjab, Khyber Pakhtunkhwa and Sindh. Filter by type or province and search by name or city.`,
  alternates: { canonical: '/places' },
}

export default function Places() {
  return (
    <>
      <section className="sec wrap">
        <Split as="h1" className="xl2">All places</Split>
        <p className="lead rv" style={{ maxWidth: 640, paddingTop: 12 }}>Gurdwaras and heritage places across Punjab, Khyber Pakhtunkhwa and Sindh.</p>
      </section>
      <Suspense fallback={null}><PlacesBrowser /></Suspense>
      <JsonLd data={{
        '@context': 'https://schema.org', '@type': 'CollectionPage', name: 'Sikh holy places in Pakistan', url: `${SITE.url}/places`,
        mainEntity: { '@type': 'ItemList', numberOfItems: PLACES.length, itemListElement: PLACES.map((p, i) => ({ '@type': 'ListItem', position: i + 1, url: `${SITE.url}/places/${p.slug}`, name: p.name })) },
      }} />
    </>
  )
}
