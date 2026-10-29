import type { Metadata } from 'next'

// The directory page is a client component, so its metadata lives here.
export const metadata: Metadata = {
  title: 'How to Cancel Any Subscription: Cancel Directory — RenewalMate',
  description: 'The real cancellation steps for Netflix, Spotify, Amazon Prime, Disney+, HBO Max, YouTube Premium, Adobe and more, straight from each company\'s own help pages. Free.',
  alternates: { canonical: 'https://www.renewalmate.com/cancel' },
}

export default function CancelLayout({ children }: { children: React.ReactNode }) {
  return children
}
