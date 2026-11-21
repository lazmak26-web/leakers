import { ArrowUpRight, Check, Copy } from 'lucide-react'
import { useLayoutEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Decrypt, useReveal } from '../components/fx'
import { Button, SectionTitle } from '../components/ui'
import { members, process, record, services, site, stats, type Member } from '../data/team'
import { writeups } from '../data/writeups'
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
    <section ref={ref} className="bg-coal">
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
              <span className="absolute left-0 top-1 grid h-8 w-8 place-items-center border border-line bg-coal font-mono text-xs">{String(i + 1).padStart(2, '0')}</span>
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
        <a href="#contact" data-reveal className="group flex flex-col justify-between gap-10 bg-void p-6 transition-colors hover:bg-signal md:p-8">
          <ArrowUpRight size={32} className="transition-transform duration-500 group-hover:rotate-45" />
          <div>
            <p className="text-2xl font-bold wide">Want to join?</p>
            <p className="mt-2 text-sm text-paper/70 group-hover:text-paper">We recruit through CTFs. Send us your best write-up.</p>
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

/* ---------- Write-ups preview ---------- */
export function WriteupsPreview() {
  const ref = useReveal<HTMLElement>()
  return (
    <section id="writeups" ref={ref} className="shell py-24 md:py-36">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <SectionTitle path="writeups" title="Latest write-ups" />
        <Link to="/writeups" className="group mb-12 inline-flex shrink-0 items-center gap-2 text-sm font-semibold md:mb-16">
          <span className="link-wipe">All write-ups</span><ArrowUpRight size={16} />
        </Link>
      </div>
      <ul className="border-t border-line">
        {writeups.map((w) => (
          <li key={w.slug} data-reveal className="border-b border-line">
            <Link to={`/writeups/${w.slug}`} className="group grid gap-3 py-7 md:grid-cols-12 md:items-baseline md:gap-8">
              <span className="font-mono text-xs text-mute md:col-span-2">{w.tag} · {w.read}</span>
              <span className="text-2xl font-bold wide transition-colors group-hover:text-signal md:col-span-6 md:text-3xl">{w.title}</span>
              <span className="text-sm text-paper/60 md:col-span-4">{w.summary}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}

/* ---------- Contact ---------- */
export function Contact() {
  const [f, setF] = useState({ name: '', email: '', org: '', service: services[0].title, message: '', authorised: false })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [sent, setSent] = useState(false)
  const [copied, setCopied] = useState(false)

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const errs: Record<string, string> = {}
    if (f.name.trim().length < 2) errs.name = 'Enter your name.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email.trim())) errs.email = 'Enter a valid email so we can reply.'
    if (f.message.trim().length < 10) errs.message = 'Tell us a little about what you want tested.'
    if (!f.authorised) errs.authorised = 'We only test assets you own or are authorised to test.'
    setErrors(errs)
    if (Object.keys(errs).length) { document.getElementById(`ct-${Object.keys(errs)[0]}`)?.focus(); return }
    const body = `Name: ${f.name}\nEmail: ${f.email}\nOrganisation: ${f.org || '—'}\nService: ${f.service}\n\n${f.message}\n\nI confirm I own or am authorised to request testing of these assets.`
    window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(`Engagement request — ${f.service}`)}&body=${encodeURIComponent(body)}`
    setSent(true)
  }

  const copy = async () => {
    try { await navigator.clipboard.writeText(site.email); setCopied(true); setTimeout(() => setCopied(false), 1800) } catch { /* clipboard blocked */ }
  }

  const input = (k: string) => `mt-2 w-full border-b bg-transparent py-3 text-lg outline-none transition-colors placeholder:text-ash focus:border-paper ${errors[k] ? 'border-signal' : 'border-line'}`
  const err = (k: string) => errors[k] && <p id={`ct-${k}-err`} className="mt-2 text-sm text-signal">{errors[k]}</p>
  const set = (k: keyof typeof f, v: string | boolean) => { setF((s) => ({ ...s, [k]: v })); if (errors[k]) setErrors((e) => ({ ...e, [k]: '' })) }

  return (
    <section id="contact" className="shell py-24 md:py-36">
      <div className="grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <SectionTitle compact path="contact" title="Start an engagement" intro="Tell us what you want tested. We reply within one business day with questions and a proposed scope." />
          <dl className="space-y-6 text-sm">
            <div>
              <dt className="text-mute">Email</dt>
              <dd className="mt-1 flex items-center gap-3 text-lg">
                <a href={`mailto:${site.email}`} className="link-wipe">{site.email}</a>
                <button onClick={copy} aria-label="Copy email address" className="text-mute hover:text-paper">{copied ? <Check size={16} /> : <Copy size={16} />}</button>
              </dd>
            </div>
            <div><dt className="text-mute">PGP fingerprint</dt><dd className="mt-1 break-all font-mono text-xs">{site.pgp}</dd></div>
            <div><dt className="text-mute">Based in</dt><dd className="mt-1">{site.location}</dd></div>
          </dl>
        </div>

        <div className="lg:col-span-6 lg:col-start-7">
          {sent ? (
            <div className="border border-line p-8" role="status">
              <p className="font-mono text-sm text-signal">[✓] request drafted</p>
              <p className="mt-4 text-3xl font-bold wide">Your email app should be open.</p>
              <p className="mt-3 text-paper/70">Send the drafted message and we will reply within one business day. If nothing opened, write to <a className="link-wipe text-paper" href={`mailto:${site.email}`}>{site.email}</a>.</p>
              <button onClick={() => setSent(false)} className="link-wipe mt-6 text-sm">Edit the request</button>
            </div>
          ) : (
            <form onSubmit={submit} noValidate className="space-y-8">
              <div className="grid gap-8 sm:grid-cols-2">
                <div>
                  <label htmlFor="ct-name" className="text-sm text-mute">Name</label>
                  <input id="ct-name" value={f.name} onChange={(e) => set('name', e.target.value)} autoComplete="name" aria-invalid={!!errors.name} aria-describedby={errors.name ? 'ct-name-err' : undefined} className={input('name')} />
                  {err('name')}
                </div>
                <div>
                  <label htmlFor="ct-email" className="text-sm text-mute">Work email</label>
                  <input id="ct-email" type="email" value={f.email} onChange={(e) => set('email', e.target.value)} autoComplete="email" aria-invalid={!!errors.email} aria-describedby={errors.email ? 'ct-email-err' : undefined} className={input('email')} />
                  {err('email')}
                </div>
                <div>
                  <label htmlFor="ct-org" className="text-sm text-mute">Organisation (optional)</label>
                  <input id="ct-org" value={f.org} onChange={(e) => set('org', e.target.value)} autoComplete="organization" className={input('org')} />
                </div>
                <div>
                  <label htmlFor="ct-service" className="text-sm text-mute">Service</label>
                  <select id="ct-service" value={f.service} onChange={(e) => set('service', e.target.value)} className={`${input('service')} cursor-pointer bg-void`}>
                    {services.map((s) => <option key={s.id}>{s.title}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label htmlFor="ct-message" className="text-sm text-mute">What should we test?</label>
                <textarea id="ct-message" rows={4} value={f.message} onChange={(e) => set('message', e.target.value)} placeholder="Targets, timeline, anything we should know" aria-invalid={!!errors.message} aria-describedby={errors.message ? 'ct-message-err' : undefined} className={`${input('message')} resize-none`} />
                {err('message')}
              </div>
              <div>
                <label className="flex cursor-pointer items-start gap-3 text-sm text-paper/80">
                  <input id="ct-authorised" type="checkbox" checked={f.authorised} onChange={(e) => set('authorised', e.target.checked)} aria-describedby={errors.authorised ? 'ct-authorised-err' : undefined} className="mt-0.5 h-4 w-4 shrink-0 accent-[#FF2020]" />
                  I own these assets or have written permission to request security testing of them.
                </label>
                {err('authorised')}
              </div>
              <Button type="submit" className="w-full sm:w-auto">Send request</Button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
