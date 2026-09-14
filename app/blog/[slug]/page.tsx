import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getPost, BLOG_POSTS } from '@/lib/blog-posts'
import type { Metadata } from 'next'
import { fontVariables, displayFont as display } from '@/lib/fonts'

export async function generateStaticParams() {
  return BLOG_POSTS.map(p => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) return {}
  return { title: `${post.title} — RenewalMate`, description: post.excerpt }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) notFound()

  const paragraphs = post.content.split('\n\n')

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
          <Link href="/blog" className="text-ink-muted hover:text-violet-bright text-sm transition-colors">← All posts</Link>
        </div>
      </nav>

      <article className="max-w-3xl mx-auto px-6 py-20">
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-5">
            <span className="text-xs font-bold text-violet-bright bg-violet/10 px-3 py-1 rounded-full">{post.category}</span>
            <span className="text-xs text-ink-faint">{new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
          </div>
          <h1 className={`${display} font-semibold text-4xl sm:text-5xl text-ink-high leading-tight mb-6`}>{post.title}</h1>
          <p className="text-ink-body text-xl leading-relaxed border-l-2 border-violet/40 pl-4">{post.excerpt}</p>
        </div>

        <div className="space-y-5">
          {paragraphs.map((para, i) => {
            if (para.startsWith('**') && para.endsWith('**')) {
              return <h3 key={i} className={`${display} font-semibold text-xl text-ink-high mt-8 mb-2`}>{para.replace(/\*\*/g, '')}</h3>
            }
            if (para.includes('**')) {
              const parts = para.split(/(\*\*[^*]+\*\*)/)
              return (
                <p key={i} className="text-ink-body leading-relaxed">
                  {parts.map((part, j) =>
                    part.startsWith('**') ? <strong key={j} className="text-ink-high font-bold">{part.replace(/\*\*/g, '')}</strong> : part
                  )}
                </p>
              )
            }
            return <p key={i} className="text-ink-body leading-relaxed">{para}</p>
          })}
        </div>

        <div className="mt-16 bg-gradient-to-br from-violet to-[#A472F0] rounded-2xl p-8 text-center">
          <h2 className={`${display} font-semibold text-2xl text-white mb-2`}>Try RenewalMate free.</h2>
          <p className="text-white/80 text-sm mb-5">No credit card. No bank sync required. Manual tracking is free forever.</p>
          <Link href="/signup" className="inline-block px-7 py-2.5 bg-white text-violet font-bold rounded-full hover:bg-white/90 transition-colors text-sm">
            Get Started Free →
          </Link>
        </div>
      </article>
    </div>
  )
}
