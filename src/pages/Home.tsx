import { useEffect } from 'react'
import { Hero } from '../sections/Hero'
import { CategoryIndex, Featured, Newsletter, Trending, VelocityStrip, WhyLeakers } from '../sections/HomeSections'

export default function Home() {
  useEffect(() => { document.title = 'LEAKERS — Your next digital advantage' }, [])
  return (
    <>
      <Hero />
      <VelocityStrip />
      <Featured />
      <Trending />
      <CategoryIndex />
      <WhyLeakers />
      <Newsletter />
    </>
  )
}
