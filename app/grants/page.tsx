'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { fontVariables, displayFont as display, monoFont as mono } from '@/lib/fonts'

interface GrantHit {
  id: string
  number: string
  title: string
  agency: string
  agencyCode: string
  openDate: string
  closeDate: string
  oppStatus: string
  docType: string
}

const ELIGIBILITY_OPTIONS = [
  { value: '', label: 'All applicants' },
  { value: '21', label: 'Individuals' },
  { value: '23', label: 'Small businesses' },
  { value: '22', label: 'For-profits (other than small business)' },
  { value: '12', label: 'Nonprofits with 501(c)(3) status' },
  { value: '13', label: 'Nonprofits without 501(c)(3) status' },
  { value: '20', label: 'Private colleges/universities' },
  { value: '06', label: 'Public colleges/universities' },
  { value: '99', label: 'Unrestricted (any entity type)' },
]

const FUNDING_CATEGORY_OPTIONS = [
  { value: '', label: 'All categories' },
  { value: 'AR', label: 'Arts' },
  { value: 'BC', label: 'Business and Commerce' },
  { value: 'CD', label: 'Community Development' },
  { value: 'ED', label: 'Education' },
  { value: 'ELT', label: 'Employment, Labor and Training' },
  { value: 'EN', label: 'Energy' },
  { value: 'ENV', label: 'Environment' },
  { value: 'FN', label: 'Food and Nutrition' },
  { value: 'HL', label: 'Health' },
  { value: 'HO', label: 'Housing' },
  { value: 'HU', label: 'Humanities' },
  { value: 'ISS', label: 'Income Security and Social Services' },
  { value: 'RD', label: 'Regional Development' },
  { value: 'ST', label: 'Science and Technology / R&D' },
  { value: 'T', label: 'Transportation' },
]

function formatDate(d: string) {
  if (!d) return '—'
  return d
}

export default function GrantsPage() {
  const [keyword, setKeyword] = useState('')
  const [eligibility, setEligibility] = useState('')
  const [fundingCategory, setFundingCategory] = useState('')
  const [hits, setHits] = useState<GrantHit[]>([])
  const [hitCount, setHitCount] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  const runSearch = useCallback(async () => {
    setLoading(true)
    setError(false)
    setHasSearched(true)
    try {
      const res = await fetch('/api/grants/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyword, eligibility, fundingCategory }),
      })
      if (!res.ok) throw new Error('search failed')
      const data = await res.json()
      setHits(data.hits ?? [])
      setHitCount(data.hitCount ?? 0)
    } catch {
      setError(true)
      setHits([])
      setHitCount(null)
    } finally {
      setLoading(false)
    }
  }, [keyword, eligibility, fundingCategory])

  useEffect(() => {
    runSearch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className={`${fontVariables} min-h-screen bg-void text-ink-body font-[family-name:var(--font-body)] antialiased`}>
      <nav className="sticky top-0 z-50 bg-void/90 backdrop-blur-md border-b border-edge">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet to-rm-amber flex items-center justify-center">
              <span className={`${display} font-semibold text-void text-sm`}>R</span>
            </div>
            <span className={`${display} font-semibold text-ink-high`}>RenewalMate</span>
          </Link>
          <div className="hidden sm:flex gap-5 text-sm items-center">
            <Link href="/grants" className="text-violet-bright font-semibold">Grants</Link>
            <Link href="/guides" className="text-ink-muted hover:text-violet-bright transition-colors">Guides</Link>
            <Link href="/blog" className="text-ink-muted hover:text-violet-bright transition-colors">Blog</Link>
            <Link href="/signup" className="px-4 py-1.5 bg-gradient-to-r from-violet to-[#A472F0] text-white text-xs font-bold rounded-full">Get Started</Link>
          </div>
          <Link href="/signup" className="sm:hidden px-4 py-1.5 bg-gradient-to-r from-violet to-[#A472F0] text-white text-xs font-bold rounded-full">Get Started</Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-20">
        <div className="mb-10 text-center">
          <p className="text-[0.7rem] font-bold tracking-[0.16em] uppercase text-ink-muted mb-3">Free Tool</p>
          <h1 className={`${display} font-semibold text-5xl text-ink-high mb-4`}>Grants Finder</h1>
          <p className="text-ink-body text-lg max-w-2xl mx-auto">
            Stop leaving free money on the table. Search live U.S. federal grant opportunities
            from grants.gov — for individuals, small businesses, and nonprofits. Free, no account
            required.
          </p>
        </div>

        {/* Search + Filters */}
        <div className="bg-panel border border-edge rounded-2xl p-5 sm:p-6 mb-8 space-y-4">
          <div className="relative">
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-faint pointer-events-none"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder="Search grants by keyword (e.g. small business, housing, education)"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && runSearch()}
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-void border border-edge-lit text-ink-high placeholder-ink-faint focus:outline-none focus:border-violet/50 text-sm transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <select
              value={eligibility}
              onChange={(e) => setEligibility(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-void border border-edge-lit text-ink-high text-sm focus:outline-none focus:border-violet/50 transition-colors"
            >
              {ELIGIBILITY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  Who can apply: {opt.label}
                </option>
              ))}
            </select>

            <select
              value={fundingCategory}
              onChange={(e) => setFundingCategory(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-void border border-edge-lit text-ink-high text-sm focus:outline-none focus:border-violet/50 transition-colors"
            >
              {FUNDING_CATEGORY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  Category: {opt.label}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={runSearch}
            disabled={loading}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-violet to-[#A472F0] text-white font-bold text-sm shadow-[0_8px_24px_-8px_rgba(139,92,246,0.55)] disabled:opacity-50"
          >
            {loading ? 'Searching…' : 'Search Grants'}
          </button>
        </div>

        {/* Results */}
        {error && (
          <div className="text-center py-12 text-ink-muted">
            Couldn&apos;t reach grants.gov right now. Try again in a moment.
          </div>
        )}

        {!error && hasSearched && (
          <>
            {hitCount !== null && (
              <p className={`${mono} text-sm text-ink-muted mb-4`}>
                {hitCount.toLocaleString()} open opportunit{hitCount === 1 ? 'y' : 'ies'} found
                {hits.length < hitCount ? ` — showing first ${hits.length}` : ''}
              </p>
            )}

            <div className="space-y-3">
              {hits.map((hit) => (
                <a
                  key={hit.id}
                  href={`https://www.grants.gov/search-results-detail/${hit.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-panel border border-edge rounded-2xl p-5 hover:border-violet/40 transition-all group"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h2 className="text-base sm:text-lg font-bold text-ink-high leading-snug group-hover:text-violet-bright transition-colors">
                      {hit.title}
                    </h2>
                    <span className="shrink-0 text-[10px] font-bold uppercase tracking-wider text-jade-bright bg-jade/10 border border-jade/25 rounded-full px-2 py-1">
                      {hit.oppStatus}
                    </span>
                  </div>
                  <p className="text-sm text-ink-muted mb-3">{hit.agency}</p>
                  <div className={`${mono} flex flex-wrap gap-x-6 gap-y-1 text-xs text-ink-faint`}>
                    <span>Posted: {formatDate(hit.openDate)}</span>
                    <span>Closes: {formatDate(hit.closeDate) || 'Rolling / Not specified'}</span>
                    <span>Opportunity #: {hit.number}</span>
                  </div>
                </a>
              ))}
            </div>

            {!loading && hits.length === 0 && (
              <div className="text-center py-12 text-ink-muted">
                No open grants matched your filters. Try a broader search or different category.
              </div>
            )}
          </>
        )}

        {/* Disclaimer */}
        <div className="mt-12 bg-panel-raised border border-violet/20 rounded-2xl p-7 text-center">
          <p className={`${display} font-semibold text-ink-high mb-1`}>Free. Always.</p>
          <p className="text-ink-muted text-sm">
            Data is pulled live from{' '}
            <a
              href="https://www.grants.gov"
              target="_blank"
              rel="noopener noreferrer"
              className="text-violet-bright hover:text-violet"
            >
              grants.gov
            </a>
            , the U.S. government&apos;s official grants database. RenewalMate doesn&apos;t
            process applications or charge for this tool — click any result to apply directly on
            grants.gov.
          </p>
          <p className="text-xs text-ink-faint mt-2">
            Brought to you by <a href="https://www.gilgameshenterprise.com" className="text-violet-bright hover:text-violet">Gilgamesh Enterprise</a>
          </p>
        </div>
      </div>

      <footer className="border-t border-edge py-8 px-6 mt-8">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xs text-ink-muted">© 2026 RenewalMate — Gilgamesh Enterprise LLC</span>
          <div className="flex gap-5 text-xs text-ink-muted">
            <a href="https://www.gilgameshenterprise.com" className="hover:text-violet-bright transition-colors">Gilgamesh Enterprise</a>
            <a href="https://socialmate.studio" className="hover:text-violet-bright transition-colors">SocialMate</a>
            <Link href="/blog" className="hover:text-violet-bright transition-colors">Blog</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
