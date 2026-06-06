import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'RenewalMate — Stop Losing Money on Bills You Forgot About',
  description: 'Track every subscription, bill, and recurring expense in one free dashboard. No paywall. No credit card. No catch. RenewalMate is free forever.',
  keywords: ['subscription tracker', 'bill tracker', 'recurring expense tracker', 'free budget app', 'RenewalMate', 'stop overpaying subscriptions'],
  openGraph: {
    title: 'RenewalMate — Free Subscription & Bill Tracker',
    description: 'The average person wastes $273/month on bills they forgot about. RenewalMate shows you exactly where your money goes — free forever.',
    url: 'https://www.renewalmate.com',
    siteName: 'RenewalMate',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RenewalMate — Free Subscription Tracker',
    description: 'Stop bleeding money on subscriptions. Free forever.',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col">
        {children}
      </body>
    </html>
  )
}
