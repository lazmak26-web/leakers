import { useEffect } from 'react'
import { CircuitPath } from '../components/CircuitPath'
import { Shop } from '../sections/Shop'

export default function ShopPage() {
  useEffect(() => { document.title = 'Shop — LEAKERS' }, [])
  return (
    <div className="relative">
      <CircuitPath />
      <div className="relative z-10"><Shop asPage /></div>
    </div>
  )
}
