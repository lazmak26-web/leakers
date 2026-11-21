import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { CircuitPath } from '../components/CircuitPath'
import { scrollToId } from '../lib/motion'
import { Hero } from '../sections/Hero'
import { Process, Services, Team } from '../sections/Sections'

export default function Home() {
  const { hash } = useLocation()
  useEffect(() => { document.title = 'LEAKERS — Ethical hacking team' }, [])
  // arriving from another page with /#section
  useEffect(() => {
    if (!hash) return
    const t = window.setTimeout(() => scrollToId(hash.slice(1)), 900)
    return () => clearTimeout(t)
  }, [hash])
  return (
    <>
      <Hero />
      <div className="relative">
        <CircuitPath />
        <div className="relative z-10">
          <Services />
          <Process />
          <Team />
        </div>
      </div>
    </>
  )
}
