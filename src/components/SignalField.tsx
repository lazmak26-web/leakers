import { useEffect, useRef } from 'react'
import { prefersReducedMotion } from '../lib/motion'

const CHARS = '01<>/{}[]#$%&*+=-_:;ABCDEF0123456789'
const CELL = 20

/**
 * A dim field of glyphs. The cursor and a periodic scan line "light up" cells,
 * which then decay. Only lit cells are redrawn each frame; the base layer is cached.
 */
export function SignalField({ className = '' }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    const base = document.createElement('canvas')
    const bctx = base.getContext('2d')!
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    let cols = 0, rows = 0, w = 0, h = 0
    let heat = new Float32Array(0)
    let glyph = new Uint8Array(0)
    let raf = 0, visible = true
    let mx = -9999, my = -9999
    let scanY = -100
    const reduce = prefersReducedMotion()

    const font = `500 ${12}px "JetBrains Mono", monospace`
    const resize = () => {
      const r = canvas.getBoundingClientRect()
      w = r.width; h = r.height
      cols = Math.ceil(w / CELL); rows = Math.ceil(h / CELL)
      for (const c of [canvas, base]) { c.width = w * dpr; c.height = h * dpr }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      bctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      heat = new Float32Array(cols * rows)
      glyph = new Uint8Array(cols * rows).map(() => (Math.random() * CHARS.length) | 0)
      bctx.clearRect(0, 0, w, h)
      bctx.font = font
      bctx.textBaseline = 'middle'
      bctx.textAlign = 'center'
      for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) {
        // sparse base: roughly a third of cells show a faint glyph
        if (((x * 7 + y * 13) % 3) !== 0) continue
        bctx.fillStyle = '#1b1b1b'
        bctx.fillText(CHARS[glyph[y * cols + x]], x * CELL + CELL / 2, y * CELL + CELL / 2)
      }
      ctx.clearRect(0, 0, w, h)
      ctx.drawImage(base, 0, 0, w, h)
    }

    const frame = () => {
      raf = requestAnimationFrame(frame)
      if (!visible) return
      // heat from cursor
      if (mx > -999) {
        const cx = Math.floor(mx / CELL), cy = Math.floor(my / CELL)
        const R = 5
        for (let y = cy - R; y <= cy + R; y++) for (let x = cx - R; x <= cx + R; x++) {
          if (x < 0 || y < 0 || x >= cols || y >= rows) continue
          const d = Math.hypot(x - cx, y - cy)
          if (d > R) continue
          const i = y * cols + x
          heat[i] = Math.max(heat[i], 1 - d / R)
        }
      }
      // heat from the scan line
      scanY += 3.2
      if (scanY > h + 200) scanY = -300
      const sy = Math.floor(scanY / CELL)
      if (sy >= 0 && sy < rows) for (let x = 0; x < cols; x++) {
        if (Math.random() < 0.35) heat[sy * cols + x] = Math.max(heat[sy * cols + x], 0.55 + Math.random() * 0.3)
      }

      ctx.clearRect(0, 0, w, h)
      ctx.drawImage(base, 0, 0, w, h)
      ctx.font = font
      ctx.textBaseline = 'middle'
      ctx.textAlign = 'center'
      for (let i = 0; i < heat.length; i++) {
        const v = heat[i]
        if (v < 0.02) continue
        heat[i] = v * 0.93
        if (Math.random() < 0.12) glyph[i] = (Math.random() * CHARS.length) | 0
        const x = (i % cols) * CELL + CELL / 2
        const y = Math.floor(i / cols) * CELL + CELL / 2
        ctx.fillStyle = v > 0.82 ? `rgba(255,32,32,${v})` : `rgba(255,255,255,${v * 0.7})`
        ctx.fillText(CHARS[glyph[i]], x, y)
      }
    }

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect()
      mx = e.clientX - r.left; my = e.clientY - r.top
    }
    const onLeave = () => { mx = -9999 }

    resize()
    if (reduce) return
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting })
    io.observe(canvas)
    const onVis = () => { visible = document.visibilityState === 'visible' }
    window.addEventListener('resize', resize)
    window.addEventListener('pointermove', onMove)
    document.addEventListener('pointerleave', onLeave)
    document.addEventListener('visibilitychange', onVis)
    raf = requestAnimationFrame(frame)
    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerleave', onLeave)
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [])

  return <canvas ref={ref} aria-hidden className={className} />
}
