import type { Place } from '@/lib/places'
import PlaceCard from './PlaceCard'

const AR_IMG = ['432/520', '432/380', '432/520', '432/440']
const AR_TILE = ['432/340', '432/360', '432/320', '432/420', '432/300']

export default function PlacesGrid({ list }: { list: Place[] }) {
  let a = 0
  let b = 0
  return (
    <div className="masonry">
      {list.map((p, i) => {
        const img = p.images.length > 0
        return <PlaceCard key={p.slug} p={p} i={i} shp={img ? i % 4 === 0 : i % 5 === 3} ar={img ? AR_IMG[a++ % 4] : AR_TILE[b++ % 5]} priority={i < 2} />
      })}
    </div>
  )
}
