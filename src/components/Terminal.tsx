import { useEffect, useRef, useState } from 'react'
import { prefersReducedMotion } from '../lib/motion'

type Line = { cmd: string; out: { text: string; tone?: 'ok' | 'warn' | 'mute' }[] }

const script: Line[] = [
  { cmd: 'scope --verify authorisation.pdf', out: [{ text: '[✓] signed authorisation found · scope: app.client.lab', tone: 'ok' }] },
  { cmd: 'recon --target app.client.lab', out: [{ text: '37 hosts · 212 endpoints · 4 exposed admin panels', tone: 'mute' }] },
  { cmd: 'exploit --chain idor,ssrf --safe', out: [{ text: '[!] critical: cross-tenant data read', tone: 'warn' }, { text: '[!] high: metadata credentials reachable', tone: 'warn' }] },
  { cmd: 'report --format pdf', out: [{ text: '[✓] 14 findings · 14 fixes · retest booked', tone: 'ok' }] },
]

const tone = { ok: 'text-paper', warn: 'text-signal', mute: 'text-mute' }

/** Types an engagement, end to end, then loops. Static on reduced motion. */
export function Terminal({ className = '' }: { className?: string }) {
  const reduce = prefersReducedMotion()
  const [step, setStep] = useState(reduce ? script.length : 0)
  const [typed, setTyped] = useState('')
  const body = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (reduce) return
    let t = 0
    if (step >= script.length) {
      t = window.setTimeout(() => { setStep(0); setTyped('') }, 3200)
      return () => clearTimeout(t)
    }
    const cmd = script[step].cmd
    if (typed.length < cmd.length) {
      t = window.setTimeout(() => setTyped(cmd.slice(0, typed.length + 1)), 28 + Math.random() * 40)
    } else {
      t = window.setTimeout(() => { setStep((s) => s + 1); setTyped('') }, 700)
    }
    return () => clearTimeout(t)
  }, [step, typed, reduce])

  return (
    <div className={`border border-line bg-void/85 font-mono text-[12px] leading-relaxed backdrop-blur-md md:text-[13px] ${className}`} role="img" aria-label="Terminal showing an authorised engagement: scope verified, reconnaissance, exploitation, report delivered">
      <div className="flex items-center justify-between border-b border-line px-4 py-2.5 text-mute">
        <span className="flex gap-1.5">
          <span className="h-2.5 w-2.5 bg-signal" /><span className="h-2.5 w-2.5 bg-ash" /><span className="h-2.5 w-2.5 bg-ash" />
        </span>
        <span>leakers@ops — engagement</span>
      </div>
      <div ref={body} className="min-h-[230px] space-y-1.5 p-4" aria-hidden>
        {script.slice(0, step).map((l) => (
          <div key={l.cmd}>
            <p><span className="text-signal">$</span> {l.cmd}</p>
            {l.out.map((o) => <p key={o.text} className={tone[o.tone ?? 'mute']}>{o.text}</p>)}
          </div>
        ))}
        {step < script.length && (
          <p><span className="text-signal">$</span> {typed}<span className="ml-0.5 inline-block h-[1.1em] w-[0.6em] translate-y-[0.2em] animate-pulse bg-paper" /></p>
        )}
      </div>
    </div>
  )
}
