import Link from 'next/link'

export default function NotFound() {
  return (
    <section className="sec wrap" style={{ minHeight: '60vh' }}>
      <h1 className="xl2">Page not found</h1>
      <p className="lead" style={{ padding: '16px 0 28px' }}>We could not find that page. Try the list of places.</p>
      <Link className="btn pri" href="/places"><span className="t">Browse places</span></Link>
    </section>
  )
}
