import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { scrollToId } from '../lib/motion'
import { Hero } from '../sections/Hero'
import { Contact, Process, Record, Services, Team, WriteupsPreview } from '../sections/Sections'

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
      <Services />
      <Process />
      <Team />
      <Record />
      <WriteupsPreview />
      <Contact />
    </>
  )
}
