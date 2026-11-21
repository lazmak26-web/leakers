import { useLayoutEffect, useRef, useState } from 'react'
import { gsap, prefersReducedMotion, ScrollTrigger } from '../lib/motion'

/**
 * A circuit-trace line that runs the full height of its parent.
 * It draws itself as you scroll, with a glowing head and nodes at each turn.
 */
export function CircuitPath() {
  const wrap = useRef<HTMLDivElement>(null)
  const trace = useRef<SVGPathElement>(null)
  const head = useRef<SVGCircleElement>(null)
  const [geo, setGeo] = useState({ w: 0, h: 0, d: '', nodes: [] as { x: number; y: number }[] })

  // build the path from the parent's real size
  useLayoutEffect(() => {
    const el = wrap.current?.parentElement
    if (!el) return
    const build = () => {
      const w = el.clientWidth
      const h = el.scrollHeight
      const edge = w < 768 ? 6 : w < 1280 ? 14 : 22
      const xs = [w - edge, edge]
      const r = 18
      // turn only in the empty space at the top of each section, so the trace never crosses text
      const top = el.getBoundingClientRect().top
      const turns = [...el.querySelectorAll('section')]
        .map((sec) => sec.getBoundingClientRect().top - top + 40)
        .filter((y) => y > 120 && y < h - 120)
      let x = xs[0]
      let y = 0
      let d = `M ${x} ${y}`
      const nodes: { x: number; y: number }[] = []
      turns.forEach((ny, k) => {
        const nx = xs[(k + 1) % 2]
        const dir = nx > x ? 1 : -1
        d += ` V ${ny - r} Q ${x} ${ny} ${x + dir * r} ${ny} H ${nx - dir * r} Q ${nx} ${ny} ${nx} ${ny + r}`
        nodes.push({ x, y: ny }, { x: nx, y: ny })
        x = nx; y = ny
      })
      d += ` V ${h}`
      setGeo({ w, h, d, nodes })
    }
    build()
    const ro = new ResizeObserver(build)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // scroll-driven drawing
  useLayoutEffect(() => {
    const p = trace.current, dot = head.current, el = wrap.current?.parentElement
    if (!p || !dot || !el || !geo.d) return
    const len = p.getTotalLength()
    if (prefersReducedMotion()) { gsap.set(p, { strokeDasharray: 'none' }); gsap.set(dot, { autoAlpha: 0 }); return }
    gsap.set(p, { strokeDasharray: len, strokeDashoffset: len })
    const st = ScrollTrigger.create({
      trigger: el,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.6,
      onUpdate: (self) => {
        const at = len * self.progress
        gsap.set(p, { strokeDashoffset: len - at })
        const pt = p.getPointAtLength(at)
        gsap.set(dot, { attr: { cx: pt.x, cy: pt.y }, autoAlpha: self.progress > 0.002 && self.progress < 0.998 ? 1 : 0 })
      },
    })
    return () => st.kill()
  }, [geo.d])

  return (
    <div ref={wrap} aria-hidden className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      {geo.d && (
        <svg width={geo.w} height={geo.h} viewBox={`0 0 ${geo.w} ${geo.h}`} className="absolute left-0 top-0">
          <defs>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="b" />
              <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>
          {/* faint full route */}
          <path d={geo.d} fill="none" stroke="#1d1d1d" strokeWidth={1} />
          {/* drawn trace */}
          <path ref={trace} d={geo.d} fill="none" stroke="#FF2020" strokeWidth={1.5} strokeOpacity={0.75} />
          {geo.nodes.map((n, i) => (
            <rect key={i} x={n.x - 3} y={n.y - 3} width={6} height={6} fill="#050505" stroke="#333" />
          ))}
          <circle ref={head} r={4} fill="#FF2020" filter="url(#glow)" opacity={0} />
        </svg>
      )}
    </div>
  )
}
