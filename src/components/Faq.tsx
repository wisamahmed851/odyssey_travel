import JsonLd from './JsonLd'

export type QA = { q: string; a: string }

/** Native <details> accordion plus FAQPage structured data (answer-engine friendly). */
export default function Faq({ items, title = 'Questions answered' }: { items: QA[]; title?: string }) {
  return (
    <section className="sec wrap" aria-labelledby="faq-h">
      <h2 id="faq-h" style={{ paddingBottom: 28 }}>{title}</h2>
      <div className="faq">
        {items.map((x) => (
          <details key={x.q}><summary>{x.q}</summary><p>{x.a}</p></details>
        ))}
      </div>
      <JsonLd data={{ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: items.map((x) => ({ '@type': 'Question', name: x.q, acceptedAnswer: { '@type': 'Answer', text: x.a } })) }} />
    </section>
  )
}
