'use client'
import { useState } from 'react'
import Link from 'next/link'
import type { BlogPost } from '@/lib/blog-posts'

const CATEGORY_COLORS: Record<string, string> = {
  'Alternatives':     'bg-blue-50 text-blue-700 border-blue-200',
  'Personal Finance': 'bg-green-50 text-green-700 border-green-200',
  'Tips':             'bg-amber-50 text-amber-700 border-amber-200',
  'Privacy':          'bg-purple-50 text-purple-700 border-purple-200',
  'Reviews':          'bg-gray-100 text-gray-700 border-gray-200',
  'Savings':          'bg-teal-50 text-teal-700 border-teal-200',
}

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
                ? 'bg-[#1e7a4a] text-white border-[#1e7a4a]'
                : 'bg-white text-gray-500 border-gray-200 hover:border-[#1e7a4a]/40 hover:text-[#1e7a4a]'
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
            className="block bg-white border border-gray-100 rounded-2xl p-6 hover:border-[#1e7a4a]/30 hover:shadow-sm transition-all group">
            <div className="flex items-center gap-3 mb-3">
              <span className={`text-xs font-bold px-3 py-1 rounded-full border ${CATEGORY_COLORS[post.category] ?? 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                {post.category}
              </span>
              <span className="text-xs text-gray-400">
                {new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
            <h2 className="text-xl font-black text-[#1a2e22] mb-2 group-hover:text-[#1e7a4a] transition-colors leading-snug">
              {post.title}
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed">{post.excerpt}</p>
            <p className="text-[#1e7a4a] text-xs font-semibold mt-4">Read more →</p>
          </Link>
        ))}
        {filtered.length === 0 && (
          <p className="text-gray-400 text-sm text-center py-12">No posts in this category yet.</p>
        )}
      </div>
    </div>
  )
}
