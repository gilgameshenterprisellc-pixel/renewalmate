'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'

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
    <div className="min-h-screen bg-[#f8faf9]">
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#1e7a4a] flex items-center justify-center">
              <span className="text-white font-black text-sm">R</span>
            </div>
            <span className="font-black text-[#1a2e22] tracking-tight">RenewalMate</span>
          </Link>
          <div className="flex gap-5 text-sm">
            <Link href="/grants" className="text-[#1e7a4a] font-semibold">Grants</Link>
            <Link href="/guides" className="text-gray-500 hover:text-[#1e7a4a] transition-colors">Guides</Link>
            <Link href="/blog" className="text-gray-500 hover:text-[#1e7a4a] transition-colors">Blog</Link>
            <Link href="/#waitlist" className="px-4 py-1.5 bg-[#1e7a4a] text-white text-xs font-bold rounded-full">Get Access</Link>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-20">
        <div className="mb-10 text-center">
          <p className="text-[#1e7a4a] text-xs font-bold tracking-[0.3em] uppercase mb-3">Free Tool</p>
          <h1 className="text-5xl font-black text-[#1a2e22] tracking-tight mb-4">Grants Finder</h1>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Stop leaving free money on the table. Search live U.S. federal grant opportunities
            from grants.gov — for individuals, small businesses, and nonprofits. Free, no account
            required.
          </p>
        </div>

        {/* Search + Filters */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 sm:p-6 mb-8 space-y-4 shadow-sm">
          <div className="relative">
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
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
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-[#f8faf9] border border-gray-100 text-[#1a2e22] placeholder-gray-400 focus:outline-none focus:border-[#1e7a4a]/50 text-sm transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <select
              value={eligibility}
              onChange={(e) => setEligibility(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-[#f8faf9] border border-gray-100 text-[#1a2e22] text-sm focus:outline-none focus:border-[#1e7a4a]/50 transition-colors"
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
              className="w-full px-4 py-3 rounded-xl bg-[#f8faf9] border border-gray-100 text-[#1a2e22] text-sm focus:outline-none focus:border-[#1e7a4a]/50 transition-colors"
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
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#1e7a4a] hover:bg-[#1a6b41] text-white font-bold text-sm transition-colors disabled:opacity-50"
          >
            {loading ? 'Searching…' : 'Search Grants'}
          </button>
        </div>

        {/* Results */}
        {error && (
          <div className="text-center py-12 text-gray-400">
            Couldn&apos;t reach grants.gov right now. Try again in a moment.
          </div>
        )}

        {!error && hasSearched && (
          <>
            {hitCount !== null && (
              <p className="text-sm text-gray-400 mb-4">
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
                  className="block bg-white border border-gray-100 rounded-2xl p-5 hover:border-[#1e7a4a]/30 hover:shadow-sm transition-all group"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h2 className="text-base sm:text-lg font-black text-[#1a2e22] leading-snug group-hover:text-[#1e7a4a] transition-colors">
                      {hit.title}
                    </h2>
                    <span className="shrink-0 text-[10px] font-bold uppercase tracking-wider text-[#1e7a4a] bg-[#f0faf5] border border-[#1e7a4a]/20 rounded-full px-2 py-1">
                      {hit.oppStatus}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mb-3">{hit.agency}</p>
                  <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-gray-400">
                    <span>Posted: {formatDate(hit.openDate)}</span>
                    <span>Closes: {formatDate(hit.closeDate) || 'Rolling / Not specified'}</span>
                    <span>Opportunity #: {hit.number}</span>
                  </div>
                </a>
              ))}
            </div>

            {!loading && hits.length === 0 && (
              <div className="text-center py-12 text-gray-400">
                No open grants matched your filters. Try a broader search or different category.
              </div>
            )}
          </>
        )}

        {/* Disclaimer */}
        <div className="mt-12 bg-[#f0faf5] border border-[#1e7a4a]/20 rounded-2xl p-7 text-center">
          <p className="text-[#1a2e22] font-black mb-1">Free. Always.</p>
          <p className="text-gray-500 text-sm">
            Data is pulled live from{' '}
            <a
              href="https://www.grants.gov"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#1e7a4a] hover:underline"
            >
              grants.gov
            </a>
            , the U.S. government&apos;s official grants database. RenewalMate doesn&apos;t
            process applications or charge for this tool — click any result to apply directly on
            grants.gov.
          </p>
          <p className="text-xs text-gray-400 mt-2">
            Brought to you by <a href="https://www.gilgameshenterprise.com" className="text-[#1e7a4a] hover:underline">Gilgamesh Enterprise</a>
          </p>
        </div>
      </div>

      <footer className="border-t border-gray-100 py-8 px-6 bg-white mt-8">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xs text-gray-400">© 2026 RenewalMate — Gilgamesh Enterprise LLC</span>
          <div className="flex gap-5 text-xs text-gray-400">
            <a href="https://www.gilgameshenterprise.com" className="hover:text-[#1e7a4a]">Gilgamesh Enterprise</a>
            <a href="https://socialmate.studio" className="hover:text-[#1e7a4a]">SocialMate</a>
            <Link href="/blog" className="hover:text-[#1e7a4a]">Blog</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
