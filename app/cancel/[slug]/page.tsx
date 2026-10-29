import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { fontVariables, displayFont as display } from '@/lib/fonts'
import { shopUrl } from '@/lib/shop'
import { CANCEL_GUIDES, CHECKED_ON, guideFor } from '@/lib/cancel-guides'

// One page per service from lib/cancel-guides.ts. Unknown slugs 404.
export const dynamicParams = false

export async function generateStaticParams() {
  return CANCEL_GUIDES.map(g => ({ slug: g.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const g = guideFor(slug)
  if (!g) return {}
  const title = `How to Cancel ${g.name}: Step-by-Step Guide — RenewalMate`
  const url = `https://www.renewalmate.com/cancel/${g.slug}`
  return {
    title,
    description: g.answer,
    openGraph: { title, description: g.answer, url },
    alternates: { canonical: url },
  }
}

export default async function CancelGuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const g = guideFor(slug)
  if (!g) notFound()

  const others = CANCEL_GUIDES.filter(o => o.slug !== g.slug).slice(0, 6)
  const schema = [
    {
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      name: `How to cancel ${g.name}`,
      description: g.answer,
      step: g.steps.map((text, i) => ({ '@type': 'HowToStep', position: i + 1, text })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        { '@type': 'Question', name: `How do I cancel ${g.name}?`, acceptedAnswer: { '@type': 'Answer', text: g.answer } },
        ...(g.after.length
          ? [{ '@type': 'Question', name: `What happens after I cancel ${g.name}?`, acceptedAnswer: { '@type': 'Answer', text: g.after.join(' ') } }]
          : []),
      ],
    },
  ]

  return (
    <div className={`${fontVariables} min-h-screen bg-void text-ink-body font-[family-name:var(--font-body)] antialiased`}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <nav className="sticky top-0 z-50 bg-void/90 backdrop-blur-md border-b border-edge">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet to-rm-amber flex items-center justify-center">
              <span className={`${display} font-semibold text-void text-sm`}>R</span>
            </div>
            <span className={`${display} font-semibold text-ink-high`}>RenewalMate</span>
          </Link>
          <Link href="/cancel" className="text-ink-muted hover:text-violet-bright text-sm transition-colors">← All cancel guides</Link>
        </div>
      </nav>

      <article className="max-w-3xl mx-auto px-6 py-16 sm:py-20">
        <div className="flex flex-wrap items-center gap-3 mb-5">
          <span className="text-xs font-bold text-violet-bright bg-violet/10 px-3 py-1 rounded-full">{g.category}</span>
          <span className="text-xs text-ink-faint">Steps checked {CHECKED_ON}</span>
        </div>
        <h1 className={`${display} font-semibold text-4xl sm:text-5xl text-ink-high leading-tight mb-6`}>How to cancel {g.name}</h1>
        <p className="text-ink-body text-lg sm:text-xl leading-relaxed border-l-2 border-violet/40 pl-4">{g.answer}</p>

        <section className="mt-12">
          <h2 className={`${display} font-semibold text-2xl text-ink-high mb-5`}>{g.stepsTitle ?? `If you pay ${g.name} directly`}</h2>
          <ol className="space-y-3">
            {g.steps.map((s, i) => (
              <li key={s} className="flex gap-4 bg-panel border border-edge rounded-2xl p-4">
                <span className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-violet/15 text-violet-bright text-sm font-bold">{i + 1}</span>
                <span className="text-ink-body leading-relaxed">{s}</span>
              </li>
            ))}
          </ol>
        </section>

        {g.otherBilling.length > 0 && (
          <section className="mt-12">
            <h2 className={`${display} font-semibold text-2xl text-ink-high mb-2`}>If someone else bills you</h2>
            <p className="text-ink-muted text-sm mb-5">Not sure? Your bank or card statement shows who charges you.</p>
            <div className="space-y-4">
              {g.otherBilling.map(b => (
                <div key={b.title} className="bg-panel border border-edge rounded-2xl p-5">
                  <h3 className="font-bold text-ink-high mb-3">{b.title}</h3>
                  {b.steps.length === 1 ? (
                    <p className="text-ink-body leading-relaxed">{b.steps[0]}</p>
                  ) : (
                    <ol className="list-decimal pl-5 space-y-1.5 text-ink-body leading-relaxed">
                      {b.steps.map(s => <li key={s}>{s}</li>)}
                    </ol>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {g.after.length > 0 && (
          <section className="mt-12">
            <h2 className={`${display} font-semibold text-2xl text-ink-high mb-5`}>What happens after you cancel</h2>
            <ul className="space-y-2.5">
              {g.after.map(a => (
                <li key={a} className="flex gap-3 text-ink-body leading-relaxed">
                  <span className="mt-2.5 h-1.5 w-1.5 flex-none rounded-full bg-jade" aria-hidden="true" />
                  <span>{a}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {g.tips.length > 0 && (
          <section className="mt-12">
            <h2 className={`${display} font-semibold text-2xl text-ink-high mb-5`}>Before you cancel</h2>
            <ul className="space-y-2.5">
              {g.tips.map(t => (
                <li key={t} className="flex gap-3 text-ink-body leading-relaxed">
                  <span className="mt-2.5 h-1.5 w-1.5 flex-none rounded-full bg-rm-amber" aria-hidden="true" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        <p className="mt-10 text-sm text-ink-muted">
          These steps come from {g.name}&apos;s own help page, checked {CHECKED_ON}:{' '}
          <a href={g.source} target="_blank" rel="noopener noreferrer" className="text-violet-bright hover:text-violet break-all">{g.source}</a>.
          Companies change their menus, so if anything looks different, that page has the current version.
        </p>

        <div className="mt-14 bg-panel-raised border border-violet/20 rounded-2xl p-8 text-center">
          <p className={`${display} font-semibold text-xl text-ink-high mb-2`}>Never get surprised by a renewal again</p>
          <p className="text-ink-muted text-sm mb-5 max-w-md mx-auto">
            RenewalMate is a free subscription tracker. Add what you pay for and it emails you before each renewal,
            so you can cancel in time instead of after the charge.
          </p>
          <Link href="/signup"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-violet to-[#A472F0] text-white font-bold rounded-full text-sm shadow-[0_8px_24px_-8px_rgba(139,92,246,0.55)]">
            Track your subscriptions free →
          </Link>
        </div>

        <section className="mt-14">
          <h2 className={`${display} font-semibold text-xl text-ink-high mb-4`}>More cancel guides</h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {others.map(o => (
              <Link key={o.slug} href={`/cancel/${o.slug}`} className="bg-panel border border-edge rounded-xl px-4 py-3 text-sm text-ink-body hover:border-violet/40 hover:text-ink-high transition-colors">
                How to cancel {o.name}
              </Link>
            ))}
          </div>
          <Link href="/cancel" className="inline-block mt-4 text-sm font-bold text-violet-bright hover:text-violet">See the full cancel directory →</Link>
        </section>
      </article>

      <footer className="border-t border-edge py-8 px-6 mt-8">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xs text-ink-muted">© 2026 RenewalMate — Gilgamesh Enterprise LLC</span>
          <div className="flex flex-wrap justify-center gap-5 text-xs text-ink-muted">
            <Link href="/cancel" className="hover:text-violet-bright transition-colors">Cancel Directory</Link>
            <Link href="/faq" className="hover:text-violet-bright transition-colors">FAQ</Link>
            <Link href="/blog" className="hover:text-violet-bright transition-colors">Blog</Link>
            <Link href="/privacy" className="hover:text-violet-bright transition-colors">Privacy</Link>
            <a href="https://www.gilgameshenterprise.com" className="hover:text-violet-bright transition-colors">Gilgamesh Enterprise</a>
            <a href={shopUrl('footer')} className="hover:text-violet-bright transition-colors">Gilgamesh Shop</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
