'use client'
import { useEffect, useRef } from 'react'

type Particle = {
  x: number
  y: number
  r: number
  speed: number
  drift: number
  color: string
  opacity: number
  life: number
}

function seededRandom(seed: number) {
  let s = seed
  return function () {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

export default function EmberField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const rand = seededRandom(42)
    let particles: Particle[] = []
    let W = 0
    let H = 0
    let raf = 0

    function size() {
      W = canvas!.width = window.innerWidth
      H = canvas!.height = window.innerHeight
    }

    function makeParticle(startY?: number): Particle {
      const isAmber = rand() > 0.5
      return {
        x: rand() * W,
        y: startY !== undefined ? startY : rand() * H,
        r: 1.2 + rand() * 2.2,
        speed: 0.15 + rand() * 0.35,
        drift: (rand() - 0.5) * 0.25,
        color: isAmber ? '217,164,65' : '139,92,246',
        opacity: 0.12 + rand() * 0.22,
        life: rand(),
      }
    }

    function init() {
      size()
      const count = reduced ? 18 : 46
      particles = Array.from({ length: count }, () => makeParticle())
    }

    function draw() {
      ctx!.clearRect(0, 0, W, H)
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        if (!reduced) {
          p.y += p.speed
          p.x += p.drift
          p.life += 0.0025
          if (p.y > H + 10) {
            particles[i] = makeParticle(-10)
            continue
          }
        }
        const fade = reduced ? p.opacity : p.opacity * (1 - Math.min(p.life, 1) * 0.4)
        const grad = ctx!.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4)
        grad.addColorStop(0, `rgba(${p.color},${fade})`)
        grad.addColorStop(1, `rgba(${p.color},0)`)
        ctx!.fillStyle = grad
        ctx!.beginPath()
        ctx!.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2)
        ctx!.fill()
      }
      if (!reduced) raf = requestAnimationFrame(draw)
    }

    init()
    draw()
    window.addEventListener('resize', size)
    return () => {
      window.removeEventListener('resize', size)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 w-screen h-screen pointer-events-none z-0"
    />
  )
}
