import { MetadataRoute } from 'next'

const BASE = 'https://www.renewalmate.com'

const VS_PAGES = [
  'rocket-money', 'monarch-money', 'ynab', 'copilot', 'pocketguard',
  'simplifi', 'mint', 'lowermysubs', 'resubscribe', 'tilla',
]

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  return [
    { url: BASE, lastModified: now, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${BASE}/guides`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/mission`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    ...VS_PAGES.map(slug => ({
      url: `${BASE}/vs/${slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ]
}
