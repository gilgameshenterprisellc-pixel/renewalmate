import { Fraunces, Manrope, IBM_Plex_Mono } from 'next/font/google'

export const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-display',
})

export const manrope = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-body',
})

export const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-mono',
})

export const fontVariables = `${fraunces.variable} ${manrope.variable} ${plexMono.variable}`
export const displayFont = 'font-[family-name:var(--font-display)]'
export const monoFont = 'font-[family-name:var(--font-mono)] [font-variant-numeric:tabular-nums]'
