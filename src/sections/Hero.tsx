import { useLayoutEffect, useRef } from 'react'
import { Decrypt } from '../components/fx'
import { SignalField } from '../components/SignalField'
import { Terminal } from '../components/Terminal'
import { Button, ButtonLink } from '../components/ui'
import { site } from '../data/team'
import { bootDelay, gsap, prefersReducedMotion, scrollToId } from '../lib/motion'

const lines = ['WE BREAK', 'IT BEFORE', 'THEY DO.']

export function Hero() {
  const root = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const el = root.current
    if (!el || prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' }, delay: 0.2 + bootDelay / 1000 })
      tl.from('[data-rule]', { scaleX: 0, transformOrigin: 'left', duration: 1.2, ease: 'expo.inOut' })
        .from('[data-fade]', { y: 24, autoAlpha: 0, duration: 1, stagger: 0.08 }, '-=0.6')
        .from('[data-term]', { y: 60, autoAlpha: 0, duration: 1.2 }, '-=0.9')
      // headline drifts up, terminal drifts down: depth on scroll
      gsap.to('[data-headline]', { yPercent: -18, ease: 'none', scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: true } })
      gsap.to('[data-term]', { yPercent: 14, ease: 'none', scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: true } })
    }, el)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} className="relative flex min-h-[100svh] flex-col overflow-hidden pt-20 md:pt-24">
      <SignalField className="absolute inset-0 h-full w-full" />
      {/* fade the field into the page at the bottom */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-void to-transparent" />

      <div className="shell relative z-10 flex flex-1 flex-col justify-center py-10">
        <div data-fade className="mb-8 flex items-center gap-3 font-mono text-xs text-mute">
          <span className="relative flex h-2 w-2"><span className="absolute inset-0 animate-ping bg-signal opacity-60" /><span className="relative h-2 w-2 bg-signal" /></span>
          {site.tagline}<span className="hidden sm:inline"> · authorised testing only</span>
        </div>

        <h1 data-headline className="display text-[clamp(2.4rem,10.4vw,9.6rem)] lg:text-[min(9.2vw,10rem)]" aria-label="We break it before they do.">
          {lines.map((l, i) => (
            <Decrypt key={l} text={l} trigger="mount" delay={bootDelay + 150 + i * 260} speed={45} className={`block ${i === 1 ? 'md:pl-[1.6em]' : ''}`} />
          ))}
        </h1>
        <span data-rule aria-hidden className="mt-8 block h-px w-full bg-line" />

        <div className="mt-8 grid gap-10 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-5">
            <p data-fade className="max-w-md text-lg leading-snug text-paper/80 md:text-xl">
              LEAKERS is an ethical hacking team. With your permission, we find the holes in your apps, networks and cloud, then help you close them.
            </p>
            <div data-fade className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button magnetic onClick={() => scrollToId('contact')} className="w-full sm:w-auto">Start an engagement</Button>
              <ButtonLink to="/writeups" variant="line" magnetic className="w-full sm:w-auto">Read our write-ups</ButtonLink>
            </div>
          </div>
          <div data-term className="lg:col-span-6 lg:col-start-7">
            <Terminal />
          </div>
        </div>
      </div>
    </section>
  )
}
