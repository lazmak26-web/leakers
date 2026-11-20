import { useEffect } from 'react'
import { ButtonLink } from '../components/ui'

export default function NotFound() {
  useEffect(() => { document.title = 'Not found — LEAKERS' }, [])
  return (
    <section className="shell flex min-h-[80vh] flex-col justify-center pt-24">
      <p className="display text-[clamp(6rem,28vw,24rem)] leading-[0.8]">
        4<span className="relative inline-block">0<span className="absolute inset-x-[-0.05em] top-[42%] h-[0.16em] bg-signal" /></span>4
      </p>
      <p className="mt-8 max-w-md text-lg text-mute">This page was never leaked. Check the address, or head back to the catalogue.</p>
      <div className="mt-8 flex flex-wrap gap-3">
        <ButtonLink to="/">Back to home</ButtonLink>
        <ButtonLink to="/explore" variant="line">Explore products</ButtonLink>
      </div>
    </section>
  )
}
