import { ArrowUpRight } from 'lucide-react'
import { useLayoutEffect, useMemo, useRef } from 'react'
import { Decrypt, useReveal } from '../components/fx'
import { SectionTitle } from '../components/ui'
import { members, process, record, services, site, stats, type Member } from '../data/team'
import { gsap, prefersReducedMotion } from '../lib/motion'

/* ---------- Services ---------- */
export function Services() {
  const ref = useReveal<HTMLElement>()
  return (
    <section id="services" ref={ref} className="shell py-24 md:py-36">
      <SectionTitle path="services" title="What we do" intro="Four ways we test you. Every engagement starts with a signed scope and ends with a fix for each finding." />
      <ul className="border-t border-line">
        {services.map((s) => (
          <li key={s.id} data-reveal className="group relative overflow-hidden border-b border-line">
            {/* scan sweep on hover */}
            <span aria-hidden className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 bg-gradient-to-r from-transparent via-signal/15 to-transparent opacity-0 transition-none group-hover:animate-[sweep_1.1s_ease-out] group-hover:opacity-100" />
            <div className="relative grid gap-4 py-8 md:grid-cols-12 md:gap-8 md:py-10">
              <h3 className="text-3xl font-bold wide tracking-tight transition-transform duration-500 ease-[var(--ease-out-expo)] md:col-span-5 md:text-5xl md:group-hover:translate-x-4">{s.title}</h3>
              <p className="max-w-md text-paper/70 md:col-span-4">{s.body}</p>
              <ul className="flex flex-wrap content-start gap-2 md:col-span-3 md:justify-end">
                {s.scope.map((t) => <li key={t} className="border border-line px-2.5 py-1 font-mono text-[11px] text-mute">{t}</li>)}
              </ul>
            </div>
          </li>
        ))}
      </ul>
      <style>{`@keyframes sweep{from{transform:translateX(0)}to{transform:translateX(420%)}}`}</style>
    </section>
  )
}

/* ---------- Process: a real sequence, so it is numbered ---------- */
export function Process() {
  const ref = useRef<HTMLElement>(null)
  useLayoutEffect(() => {
    const el = ref.current
    if (!el || prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      gsap.fromTo('[data-progress]', { scaleY: 0 }, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: '[data-steps]', start: 'top 70%', end: 'bottom 60%', scrub: true } })
      gsap.utils.toArray<HTMLElement>('[data-step]').forEach((s) => {
        gsap.fromTo(s, { autoAlpha: 0.25 }, { autoAlpha: 1, ease: 'none', scrollTrigger: { trigger: s, start: 'top 75%', end: 'top 55%', scrub: true } })
      })
    }, el)
    return () => ctx.revert()
  }, [])
  return (
    <section ref={ref} className="bg-coal/70">
      <div className="shell grid gap-12 py-24 md:py-36 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-32">
            <SectionTitle compact path="process" title="How an engagement runs" intro="Same five steps every time. You always know what we are doing and why." />
          </div>
        </div>
        <ol data-steps className="relative lg:col-span-6 lg:col-start-7">
          <span aria-hidden className="absolute bottom-0 left-[15px] top-0 w-px bg-line" />
          <span aria-hidden data-progress className="absolute bottom-0 left-[15px] top-0 w-px origin-top bg-signal" />
          {process.map((p, i) => (
            <li key={p.title} data-step className="relative pb-14 pl-14 last:pb-0">
              <span className="absolute left-0 top-1 grid h-8 w-8 place-items-center border border-line bg-void font-mono text-xs">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="text-2xl font-bold wide md:text-3xl">{p.title}</h3>
              <p className="mt-3 max-w-md text-paper/70">{p.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

/* ---------- Team ---------- */
/** Symmetric 5×5 pixel sigil derived from the handle: an avatar without photos. */
function Sigil({ seed }: { seed: string }) {
  const cells = useMemo(() => {
    let h = 2166136261
    for (const c of seed) h = Math.imul(h ^ c.charCodeAt(0), 16777619)
    const out: { x: number; y: number; red: boolean }[] = []
    for (let y = 0; y < 5; y++) for (let x = 0; x < 3; x++) {
      const bit = (h >>> (y * 3 + x)) & 1
      if (!bit) continue
      const red = ((h >>> (y + 17)) & 3) === 0
      out.push({ x, y, red })
      if (x < 2) out.push({ x: 4 - x, y, red })
    }
    return out
  }, [seed])
  return (
    <svg viewBox="0 0 5 5" className="h-full w-full" aria-hidden shapeRendering="crispEdges">
      {cells.map((c, i) => <rect key={i} x={c.x} y={c.y} width={1} height={1} fill={c.red ? '#FF2020' : '#fff'} />)}
    </svg>
  )
}

function Operator({ m }: { m: Member }) {
  return (
    <article data-reveal className="group relative flex flex-col justify-between gap-10 bg-void p-6 transition-colors duration-500 hover:bg-coal md:p-8">
      <div className="flex items-start justify-between">
        <div className="h-14 w-14 transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:scale-110"><Sigil seed={m.handle} /></div>
        {m.certs && <span className="font-mono text-[11px] text-mute">{m.certs}</span>}
      </div>
      <div>
        <Decrypt as="h3" trigger="hover" text={m.handle} className="block font-mono text-2xl font-medium md:text-3xl" />
        <p className="mt-1 text-sm text-paper/70">{m.role}</p>
        <ul className="mt-5 flex flex-wrap gap-x-3 gap-y-1 text-sm text-mute">
          {m.focus.map((f) => <li key={f}>{f}</li>)}
        </ul>
      </div>
      <span aria-hidden className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-signal transition-transform duration-500 group-hover:scale-x-100" />
    </article>
  )
}

export function Team() {
  const ref = useReveal<HTMLElement>()
  return (
    <section id="team" ref={ref} className="shell py-24 md:py-36">
      <SectionTitle path="team" title="The operators" intro="A small team of specialists. You talk directly to the people doing the testing." />
      <div className="grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
        {members.map((m) => <Operator key={m.handle} m={m} />)}
        <a href={site.discord} target="_blank" rel="noreferrer noopener" data-reveal className="group flex flex-col justify-between gap-10 bg-void p-6 transition-colors hover:bg-signal md:p-8">
          <ArrowUpRight size={32} className="transition-transform duration-500 group-hover:rotate-45" />
          <div>
            <p className="text-2xl font-bold wide">Want to join?</p>
            <p className="mt-2 text-sm text-paper/70 group-hover:text-paper">We recruit through CTFs. Come talk to us on Discord.</p>
          </div>
        </a>
      </div>
    </section>
  )
}

/* ---------- Track record ---------- */
function Counter({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  useLayoutEffect(() => {
    const el = ref.current
    const n = parseInt(value, 10)
    if (!el || isNaN(n) || n === 0 || prefersReducedMotion()) return
    const suffix = value.replace(/^\d+/, '')
    const obj = { v: 0 }
    const t = gsap.to(obj, {
      v: n, duration: 1.6, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 90%', once: true },
      onUpdate: () => { el.textContent = Math.round(obj.v) + suffix },
    })
    return () => { t.kill() }
  }, [value])
  return <span ref={ref}>{value}</span>
}

export function Record() {
  const ref = useReveal<HTMLElement>()
  return (
    <section id="record" ref={ref} className="shell py-24 md:py-36">
      <SectionTitle path="record" title="Track record" />
      <div className="grid grid-cols-2 gap-px border border-line bg-line lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} data-reveal className="bg-void p-6 md:p-8">
            <p className="text-5xl font-bold condensed md:text-7xl"><Counter value={s.value} /></p>
            <p className="mt-3 text-sm text-mute">{s.label}</p>
          </div>
        ))}
      </div>
      <ul className="mt-12 border-t border-line">
        {record.map((r) => (
          <li key={r.event + r.year} data-reveal className="grid grid-cols-[56px_1fr_auto] items-baseline gap-4 border-b border-line py-5 md:grid-cols-[120px_1fr_auto]">
            <span className="font-mono text-sm text-mute">{r.year}</span>
            <span className="text-lg md:text-2xl">{r.event}</span>
            <span className="font-semibold wide text-signal">{r.result}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}

