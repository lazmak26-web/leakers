import { useEffect } from 'react'
import { Decrypt } from '../components/fx'
import { ButtonLink } from '../components/ui'

export default function NotFound() {
  useEffect(() => { document.title = 'Not found — LEAKERS' }, [])
  return (
    <section className="shell flex min-h-[80vh] flex-col justify-center pt-24">
      <p className="font-mono text-sm text-signal">$ curl -I {typeof window !== 'undefined' ? window.location.pathname : ''}</p>
      <Decrypt as="p" trigger="mount" text="404" className="display mt-4 block text-[clamp(6rem,28vw,24rem)] leading-[0.8]" />
      <p className="mt-8 max-w-md text-lg text-mute">Nothing here. This page does not exist, or it was never public.</p>
      <div className="mt-8"><ButtonLink to="/">Back to home</ButtonLink></div>
    </section>
  )
}
