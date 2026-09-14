'use client'
import { useState } from 'react'
import Link from 'next/link'
import type { BlogPost } from '@/lib/blog-posts'

const CATEGORY_COLORS: Record<string, string> = {
  'Alternatives':      'bg-blue-500/10 text-blue-400 border-blue-500/30',
  'Personal Finance':  'bg-jade/10 text-jade-bright border-jade/30',
  'Tips':              'bg-rm-amber/10 text-rm-amber-bright border-rm-amber/30',
  'Privacy':           'bg-violet/10 text-violet-bright border-violet/30',
  'Reviews':           'bg-ink-faint/10 text-ink-muted border-edge-lit',
  'Savings':           'bg-teal-500/10 text-teal-400 border-teal-500/30',
  'Budgeting':         'bg-rose-500/10 text-rose-400 border-rose-500/30',
  'Comparisons':       'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
}
const FALLBACK_COLOR = 'bg-ink-faint/10 text-ink-muted border-edge-lit'

export default function BlogClient({ posts }: { posts: BlogPost[] }) {
  const categories = ['All', ...Array.from(new Set(posts.map(p => p.category))).sort()]
  const [active, setActive] = useState('All')

  const filtered = active === 'All' ? posts : posts.filter(p => p.category === active)

  return (
    <div>
      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 mb-10">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all border ${
              active === cat
                ? 'bg-violet text-white border-violet'
                : 'bg-panel text-ink-muted border-edge-lit hover:border-violet/40 hover:text-violet-bright'
            }`}
          >
            {cat}
            {cat !== 'All' && (
              <span className="ml-1.5 opacity-60">{posts.filter(p => p.category === cat).length}</span>
            )}
          </button>
        ))}
      </div>

      {/* Post list */}
      <div className="space-y-5">
        {filtered.map(post => (
          <Link key={post.slug} href={`/blog/${post.slug}`}
            className="block bg-panel border border-edge rounded-2xl p-6 hover:border-violet/40 transition-all group">
            <div className="flex items-center gap-3 mb-3">
              <span className={`text-xs font-bold px-3 py-1 rounded-full border ${CATEGORY_COLORS[post.category] ?? FALLBACK_COLOR}`}>
                {post.category}
              </span>
              <span className="text-xs text-ink-faint">
                {new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
            <h2 className="text-xl font-bold text-ink-high mb-2 group-hover:text-violet-bright transition-colors leading-snug">
              {post.title}
            </h2>
            <p className="text-ink-muted text-sm leading-relaxed">{post.excerpt}</p>
            <p className="text-violet-bright text-xs font-semibold mt-4">Read more →</p>
          </Link>
        ))}
        {filtered.length === 0 && (
          <p className="text-ink-muted text-sm text-center py-12">No posts in this category yet.</p>
        )}
      </div>
    </div>
  )
}
