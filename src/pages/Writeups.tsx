import { ArrowLeft } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Decrypt, useReveal } from '../components/fx'
import { ButtonLink, Path } from '../components/ui'
import { writeupBySlug, writeups, type Writeup } from '../data/writeups'

const fmt = (d: string) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

export function WriteupList() {
  const [tag, setTag] = useState<Writeup['tag'] | null>(null)
  const ref = useReveal<HTMLUListElement>('[data-reveal]', [tag])
  useEffect(() => { document.title = 'Write-ups — LEAKERS' }, [])
  const list = writeups.filter((w) => !tag || w.tag === tag)
  const tags = [...new Set(writeups.map((w) => w.tag))]
  return (
    <div className="shell pt-36 md:pt-44">
      <Path>writeups</Path>
      <Decrypt as="h1" trigger="mount" text="Write-ups" className="display block text-[clamp(3rem,10vw,9rem)]" />
      <p className="mt-6 max-w-xl text-lg text-paper/70">What we learn, written up so developers can fix it. Every example runs against lab targets we own.</p>
      <div className="mt-10 flex flex-wrap gap-2" role="group" aria-label="Filter by topic">
        {[null, ...tags].map((t) => (
          <button key={t ?? 'all'} onClick={() => setTag(t)} aria-pressed={tag === t} className={`border px-4 py-2 font-mono text-xs transition-colors ${tag === t ? 'border-paper bg-paper text-void' : 'border-line text-paper/80 hover:border-paper'}`}>
            {t ?? 'All'}
          </button>
        ))}
      </div>
      <ul ref={ref} className="mt-10 border-t border-line">
        {list.map((w) => (
          <li key={w.slug} data-reveal className="border-b border-line">
            <Link to={`/writeups/${w.slug}`} className="group grid gap-3 py-8 md:grid-cols-12 md:items-baseline md:gap-8">
              <span className="font-mono text-xs text-mute md:col-span-2">{fmt(w.date)}</span>
              <span className="md:col-span-6">
                <span className="block text-2xl font-bold wide transition-colors group-hover:text-signal md:text-4xl">{w.title}</span>
                <span className="mt-3 block max-w-lg text-paper/60">{w.summary}</span>
              </span>
              <span className="font-mono text-xs text-mute md:col-span-4 md:text-right">{w.tag} · {w.read} read</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function WriteupPage() {
  const { slug = '' } = useParams()
  const w = writeupBySlug(slug)
  useEffect(() => { document.title = `${w?.title ?? 'Not found'} — LEAKERS` }, [w])
  if (!w) {
    return (
      <div className="shell pt-40">
        <p className="display text-5xl">Write-up not found.</p>
        <div className="mt-8"><ButtonLink to="/writeups">All write-ups</ButtonLink></div>
      </div>
    )
  }
  const next = writeups[(writeups.indexOf(w) + 1) % writeups.length]
  return (
    <article className="shell pt-32 md:pt-40">
      <Link to="/writeups" className="inline-flex items-center gap-2 text-sm text-mute hover:text-paper"><ArrowLeft size={14} /> All write-ups</Link>
      <header className="mt-10 max-w-4xl">
        <p className="font-mono text-xs text-mute"><span className="text-signal">{w.tag}</span> · {fmt(w.date)} · {w.read} read</p>
        <Decrypt as="h1" trigger="mount" speed={18} text={w.title} className="display mt-5 block text-[clamp(2.4rem,6vw,5.5rem)]" />
        <p className="mt-6 text-xl text-paper/70">{w.summary}</p>
      </header>
      <div className="mt-14 max-w-2xl space-y-6 border-t border-line pt-10">
        {w.body.map((b, i) =>
          b.h ? <h2 key={i} className="pt-6 text-2xl font-bold wide">{b.h}</h2>
          : b.code ? <pre key={i} className="overflow-x-auto border-l-2 border-signal bg-coal p-5 font-mono text-[13px] leading-relaxed text-paper/90" data-lenis-prevent><code>{b.code}</code></pre>
          : <p key={i} className="text-lg leading-relaxed text-paper/80">{b.p}</p>,
        )}
      </div>
      <Link to={`/writeups/${next.slug}`} className="group mt-24 block border-t border-line pt-8">
        <span className="font-mono text-xs text-mute">Next write-up</span>
        <span className="mt-3 block text-3xl font-bold wide transition-colors group-hover:text-signal md:text-5xl">{next.title}</span>
      </Link>
    </article>
  )
}
