import { useLayoutEffect, useRef } from 'react'
import { Decrypt } from '../components/fx'
import { SignalField } from '../components/SignalField'
import { Terminal } from '../components/Terminal'
import { ButtonLink } from '../components/ui'
import { site } from '../data/team'
import { bootDelay, gsap, prefersReducedMotion } from '../lib/motion'

const lines = ['WE BREAK', 'IT BEFORE', 'THEY DO.']

export function Hero() {
  const root = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const el = root.current
    if (!el) return
    // Reduced motion: keep the hero visible (no parallax / draw-in). The decrypt
    // headline still fades, and sections below fade in on scroll.
    if (prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' }, delay: 0.2 + bootDelay / 1000 })
      tl.from('[data-rule]', { scaleX: 0, transformOrigin: 'left', duration: 1.2, ease: 'expo.inOut' })
        .from('[data-fade]', { y: 24, autoAlpha: 0, duration: 1, stagger: 0.08 }, '-=0.6')
        .from('[data-prism]', { autoAlpha: 0, y: -40, rotate: -6, duration: 1.3 }, '-=1')
        .from('[data-term]', { y: 60, autoAlpha: 0, duration: 1.2 }, '-=0.9')
      // headline drifts up, terminal drifts down: depth on scroll
      gsap.to('[data-headline]', { yPercent: -18, ease: 'none', scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: true } })
      gsap.to('[data-term]', { yPercent: 14, ease: 'none', scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: true } })
      // Continuous float — the prism drifts and tilts so it never looks static.
      gsap.to('[data-prism] img', { y: 30, rotate: 4.5, duration: 4, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: bootDelay / 1000 + 1.3 })
      gsap.to('[data-prism]', { x: -18, duration: 5.6, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: bootDelay / 1000 + 1.3 })
      gsap.to('[data-term-float]', { y: 12, duration: 3.6, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: bootDelay / 1000 + 1.8 })
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

        <h1 data-headline className="display text-[clamp(1.9rem,7.2vw,5.6rem)] lg:text-[min(6vw,6.4rem)]" aria-label="We break it before they do.">
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
              <ButtonLink to="/shop" variant="signal" magnetic className="w-full sm:w-auto">Start an engagement</ButtonLink>
              <a href={site.discord} target="_blank" rel="noreferrer noopener" className="inline-flex h-14 w-full items-center justify-center border border-paper/30 px-7 text-[13px] font-semibold tracking-[0.04em] wide transition-colors hover:border-paper hover:bg-paper hover:text-void sm:w-auto">Join our Discord</a>
            </div>
          </div>
          <div className="relative lg:col-span-6 lg:col-start-7">
            {/* Floating prism logo — the hero's side visual on desktop */}
            <div data-prism className="pointer-events-none absolute -top-72 right-[2%] z-20 hidden w-[clamp(360px,36vw,580px)] [perspective:1000px] lg:block xl:-top-80">
              <div aria-hidden className="absolute inset-8 -z-10 rounded-full bg-signal/30 blur-[80px]" />
              <img src="/logo.png" alt="" className="w-full drop-shadow-[0_40px_70px_rgba(0,0,0,0.85)]" />
            </div>
            <div data-term className="lg:pt-24">
              <div data-term-float>
                <Terminal />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
