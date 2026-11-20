import { useEffect } from 'react'
import { SplitText, useReveal } from '../components/fx'
import { ButtonLink } from '../components/ui'

const stats = [
  { v: '68,000+', l: 'files delivered in 2026' },
  { v: '1 in 9', l: 'submissions make it to the shelf' },
  { v: '140', l: 'countries with at least one buyer' },
  { v: '4.8', l: 'average product rating' },
]

const steps = [
  { t: 'Submitted', b: 'Makers send us finished work, never ideas. We ask for the source files, not the screenshots.' },
  { t: 'Tested', b: 'Someone on our team uses the product on a real project for a week. If it slows them down, it goes back.' },
  { t: 'Documented', b: 'Every product ships with setup notes, a changelog and a clear licence. No guessing.' },
  { t: 'Released', b: 'It goes on the shelf, the maker keeps 80% of every sale, and updates are free for buyers.' },
]

export default function About() {
  useEffect(() => { document.title = 'About — LEAKERS' }, [])
  const ref = useReveal<HTMLDivElement>()
  return (
    <div ref={ref}>
      <header className="shell pt-36 md:pt-48">
        <SplitText as="h1" text="We find the good stuff before everyone else does." className="display block max-w-[14ch] text-[clamp(2.8rem,8vw,8rem)]" />
        <div className="mt-14 grid gap-8 md:grid-cols-12">
          <p className="text-xl text-paper/80 md:col-span-5 md:col-start-6">
            LEAKERS started in 2023 as a private folder shared between six designers: the kits, presets and tools we actually used, passed around before anyone else had them. People kept asking for the link. So we built a shop.
          </p>
          <p className="text-mute md:col-span-4 md:col-start-6">
            We are still small, and we still say no to most things. Every product is made by an independent maker, tested by our team, and sold with a licence you can read in a minute.
          </p>
        </div>
      </header>

      <section className="shell mt-28 grid grid-cols-2 gap-px bg-line md:grid-cols-4">
        {stats.map((s) => (
          <div key={s.l} data-reveal className="bg-void p-6 md:p-8">
            <p className="text-5xl font-bold condensed md:text-7xl">{s.v}</p>
            <p className="mt-3 text-sm text-mute">{s.l}</p>
          </div>
        ))}
      </section>

      <section className="shell mt-28">
        <h2 className="display text-[clamp(2.2rem,5vw,4.5rem)]">How a product gets listed</h2>
        <ol className="mt-12 grid gap-px bg-line md:grid-cols-4">
          {steps.map((s, i) => (
            <li key={s.t} data-reveal className="bg-void p-6 md:p-8">
              <span className="font-mono text-xs text-signal">Step {i + 1}</span>
              <h3 className="mt-8 text-2xl font-bold wide">{s.t}</h3>
              <p className="mt-3 text-mute">{s.b}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="shell mt-28 flex flex-col items-start justify-between gap-8 border-t border-line pt-12 md:flex-row md:items-end">
        <p className="max-w-xl text-3xl font-semibold wide">Make something good? We take submissions every month.</p>
        <div className="flex flex-wrap gap-3">
          <ButtonLink to="/explore" magnetic>Explore products</ButtonLink>
          <ButtonLink to="/legal/licence" variant="line">Read the licence</ButtonLink>
        </div>
      </section>
    </div>
  )
}
