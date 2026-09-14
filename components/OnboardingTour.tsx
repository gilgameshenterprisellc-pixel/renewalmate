'use client'
import { useEffect, useState, useCallback } from 'react'
import { displayFont as display } from '@/lib/fonts'

export interface TourStep {
  target: string
  title: string
  body: string
}

interface Rect {
  top: number
  left: number
  width: number
  height: number
}

export default function OnboardingTour({
  steps,
  onFinish,
}: {
  steps: TourStep[]
  onFinish: () => void
}) {
  const [stepIndex, setStepIndex] = useState(0)
  const [rect, setRect] = useState<Rect | null>(null)
  const step = steps[stepIndex]
  const isLast = stepIndex === steps.length - 1

  const measure = useCallback(() => {
    const el = document.querySelector(`[data-tour="${step.target}"]`)
    if (!el) {
      setRect(null)
      return
    }
    const r = el.getBoundingClientRect()
    setRect({ top: r.top, left: r.left, width: r.width, height: r.height })
  }, [step.target])

  useEffect(() => {
    const el = document.querySelector(`[data-tour="${step.target}"]`)
    el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    const t = setTimeout(measure, 300)
    window.addEventListener('resize', measure)
    return () => {
      clearTimeout(t)
      window.removeEventListener('resize', measure)
    }
  }, [step.target, measure])

  function next() {
    if (isLast) {
      onFinish()
    } else {
      setStepIndex((i) => i + 1)
    }
  }

  const pad = 8
  const spotlightStyle = rect
    ? {
        top: rect.top - pad,
        left: rect.left - pad,
        width: rect.width + pad * 2,
        height: rect.height + pad * 2,
      }
    : null

  // Position the card below the spotlight, or above if there's not enough room.
  const cardTop = rect
    ? rect.top + rect.height + pad + 16 > window.innerHeight - 160
      ? Math.max(16, rect.top - pad - 16 - 170)
      : rect.top + rect.height + pad + 16
    : window.innerHeight / 2 - 90
  const cardLeft = rect ? Math.min(Math.max(16, rect.left), window.innerWidth - 336) : window.innerWidth / 2 - 160

  return (
    <div className="fixed inset-0 z-[100]" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/70" />
      {spotlightStyle && (
        <div
          className="absolute rounded-xl border-2 border-violet shadow-[0_0_0_9999px_rgba(0,0,0,0.7)] pointer-events-none transition-all duration-300"
          style={spotlightStyle}
        />
      )}
      <div
        className="absolute w-80 bg-panel border border-edge-lit rounded-2xl p-5 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.6)] transition-all duration-300"
        style={{ top: cardTop, left: cardLeft }}
      >
        <div className="text-[0.68rem] font-bold uppercase tracking-wider text-ink-faint mb-2">
          Step {stepIndex + 1} of {steps.length}
        </div>
        <h3 className={`${display} font-semibold text-base text-ink-high mb-1.5`}>{step.title}</h3>
        <p className="text-sm text-ink-body leading-relaxed mb-4">{step.body}</p>
        <div className="flex items-center justify-between">
          <button
            onClick={onFinish}
            className="text-xs font-bold text-ink-muted hover:text-ink-high transition-colors"
          >
            Skip tour
          </button>
          <button
            onClick={next}
            className="px-4 py-2 rounded-full bg-gradient-to-r from-violet to-[#A472F0] text-white text-xs font-bold shadow-[0_8px_20px_-8px_rgba(139,92,246,0.55)]"
          >
            {isLast ? "Got it, let's go" : 'Next'}
          </button>
        </div>
      </div>
    </div>
  )
}
