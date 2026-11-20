import { memo, useId, type ReactElement } from 'react'
import type { ArtKind } from '../data/types'

/** Deterministic PRNG so each product always renders the same cover. */
function rng(seed: number) {
  let s = seed * 9301 + 49297
  return () => {
    s = (s * 9301 + 49297) % 233280
    return s / 233280
  }
}

const RED = '#FF2020'
const W = 400
const H = 500

interface Props {
  kind: ArtKind
  seed: number
  label: string
  code?: string
  view?: number
  className?: string
}

function Grid({ r, view }: { r: () => number; view: number }) {
  const cols = 3 + Math.floor(r() * 2)
  const els: ReactElement[] = []
  const pad = 48
  const top = 92
  const cw = (W - pad * 2 - (cols - 1) * 12) / cols
  const redIndex = Math.floor(r() * cols * 3)
  for (let row = 0; row < 3; row++) {
    for (let c = 0; c < cols; c++) {
      const i = row * cols + c
      const h = 60 + r() * 70
      const y = top + row * 128 + (view % 2 ? r() * 10 : 0)
      els.push(
        <g key={i}>
          <rect x={pad + c * (cw + 12)} y={y} width={cw} height={h} fill={i === redIndex ? RED : 'none'} stroke={i === redIndex ? RED : '#3a3a3a'} />
          <rect x={pad + c * (cw + 12) + 8} y={y + h + 8} width={cw * (0.4 + r() * 0.5)} height={4} fill="#555" />
          <rect x={pad + c * (cw + 12) + 8} y={y + h + 16} width={cw * 0.3} height={4} fill="#333" />
        </g>,
      )
    }
  }
  return (
    <g>
      <rect x={pad} y={44} width={W - pad * 2} height={28} fill="none" stroke="#3a3a3a" />
      <circle cx={pad + 14} cy={58} r={5} fill="#fff" />
      <rect x={W - pad - 70} y={52} width={58} height={12} fill="#fff" />
      {els}
    </g>
  )
}

function Frame({ r, seed }: { r: () => number; seed: number }) {
  const variant = seed % 3
  const lines = 2 + Math.floor(r() * 2)
  const chrome = (
    <>
      <rect x={36} y={56} width={W - 72} height={H - 112} fill="#0c0c0c" stroke="#333" />
      <line x1={36} y1={80} x2={W - 36} y2={80} stroke="#333" />
      {[0, 1, 2].map((i) => <circle key={i} cx={52 + i * 12} cy={68} r={3} fill={i === 0 ? RED : '#444'} />)}
    </>
  )
  if (variant === 1) {
    // split hero: text left, image block right, card row below
    return (
      <g>
        {chrome}
        {Array.from({ length: lines + 1 }).map((_, i) => (
          <rect key={i} x={56} y={112 + i * 26} width={110 + r() * 40} height={16} fill="#fff" />
        ))}
        <rect x={56} y={130 + (lines + 1) * 26} width={70} height={20} fill={RED} />
        <rect x={200} y={104} width={144} height={170} fill="#1d1d1d" />
        <circle cx={272} cy={189} r={36 + r() * 20} fill="none" stroke="#fff" />
        {[0, 1, 2].map((i) => (
          <g key={i}>
            <rect x={56 + i * 98} y={306} width={86} height={70} fill="none" stroke="#333" />
            <rect x={64 + i * 98} y={386} width={50 + r() * 30} height={5} fill="#555" />
          </g>
        ))}
      </g>
    )
  }
  if (variant === 2) {
    // centred editorial: oversized heading, rule, list rows
    return (
      <g>
        {chrome}
        <rect x={80} y={120} width={W - 160} height={44} fill="#fff" />
        <rect x={120} y={174} width={W - 240} height={44} fill="#fff" />
        <line x1={56} y1={250} x2={W - 56} y2={250} stroke={RED} strokeWidth={2} />
        {Array.from({ length: 5 }).map((_, i) => (
          <g key={i}>
            <rect x={56} y={272 + i * 28} width={140 + r() * 80} height={8} fill={i === 0 ? '#fff' : '#444'} />
            <rect x={W - 96} y={272 + i * 28} width={40} height={8} fill="#333" />
          </g>
        ))}
      </g>
    )
  }
  return (
    <g>
      {chrome}
      {Array.from({ length: lines + 1 }).map((_, i) => (
        <rect key={i} x={60} y={118 + i * 40} width={(W - 140) * (0.5 + r() * 0.5)} height={26} fill="#fff" />
      ))}
      <rect x={60} y={130 + (lines + 1) * 40} width={110} height={30} fill={RED} />
      <rect x={180} y={130 + (lines + 1) * 40} width={90} height={30} fill="none" stroke="#fff" />
      <rect x={60} y={H - 150} width={W - 120} height={70} fill="none" stroke="#2a2a2a" />
      <line x1={60} y1={H - 150} x2={W - 60} y2={H - 80} stroke="#2a2a2a" />
      <line x1={W - 60} y1={H - 150} x2={60} y2={H - 80} stroke="#2a2a2a" />
    </g>
  )
}

function Curve({ r, view }: { r: () => number; view: number }) {
  const a = 0.15 + r() * 0.35
  const b = 0.55 + r() * 0.35
  const x0 = 50, y0 = 410, size = 300
  const d = `M ${x0} ${y0} C ${x0 + size * a} ${y0 - size * (a * 0.4)}, ${x0 + size * b} ${y0 - size * (b + 0.15)}, ${x0 + size} ${y0 - size}`
  const bands = 9
  return (
    <g>
      {Array.from({ length: bands }).map((_, i) => (
        <rect key={i} x={0} y={i * (H / bands)} width={W} height={H / bands + 1} fill={`rgb(${12 + i * 7},${12 + i * 7},${12 + i * 7})`} opacity={view === 2 ? 0.6 : 1} />
      ))}
      {Array.from({ length: 5 }).map((_, i) => (
        <g key={i}>
          <line x1={x0 + (size / 4) * i} y1={y0} x2={x0 + (size / 4) * i} y2={y0 - size} stroke="#ffffff22" />
          <line x1={x0} y1={y0 - (size / 4) * i} x2={x0 + size} y2={y0 - (size / 4) * i} stroke="#ffffff22" />
        </g>
      ))}
      <line x1={x0} y1={y0} x2={x0 + size} y2={y0 - size} stroke="#ffffff44" strokeDasharray="4 6" />
      <path d={d} fill="none" stroke={RED} strokeWidth={3} />
      <circle cx={x0 + size * a} cy={y0 - size * (a * 0.4)} r={6} fill="#050505" stroke="#fff" strokeWidth={2} />
      <circle cx={x0 + size * b} cy={y0 - size * (b + 0.15)} r={6} fill="#050505" stroke="#fff" strokeWidth={2} />
    </g>
  )
}

function Mesh({ r, view }: { r: () => number; view: number }) {
  const cx = 120 + r() * 160
  const cy = 160 + r() * 180
  const rings = 22
  const wob = 6 + r() * 14
  const phase = r() * Math.PI * 2
  return (
    <g>
      {Array.from({ length: rings }).map((_, i) => {
        const rad = 14 + i * (12 + view * 2)
        const pts = Array.from({ length: 48 }).map((_, k) => {
          const t = (k / 48) * Math.PI * 2
          const rr = rad + Math.sin(t * 3 + phase + i * 0.35) * wob * (i / rings + 0.3)
          return `${(cx + Math.cos(t) * rr).toFixed(1)},${(cy + Math.sin(t) * rr * 1.1).toFixed(1)}`
        })
        return <polygon key={i} points={pts.join(' ')} fill="none" stroke={i === 7 ? RED : i % 4 === 0 ? '#ffffffaa' : '#ffffff33'} strokeWidth={i === 7 ? 2 : 1} />
      })}
    </g>
  )
}

function Terminal({ r, label }: { r: () => number; label: string }) {
  const lines = 12
  return (
    <g fontFamily="JetBrains Mono, monospace" fontSize={13}>
      <text x={40} y={70} fill="#888">$ leakers run {label.toLowerCase()} --all</text>
      {Array.from({ length: lines }).map((_, i) => {
        const indent = Math.floor(r() * 3) * 22
        const w = 60 + r() * 220
        const accent = r() > 0.8
        return (
          <g key={i}>
            <text x={40} y={110 + i * 26} fill="#444">{String(i + 1).padStart(2, '0')}</text>
            <rect x={78 + indent} y={100 + i * 26} width={w} height={10} fill={accent ? RED : i % 3 === 0 ? '#fff' : '#3a3a3a'} />
          </g>
        )
      })}
      <rect x={78} y={100 + lines * 26} width={10} height={16} fill="#fff" />
    </g>
  )
}

function TypeCover({ r, label, view }: { r: () => number; label: string; view: number }) {
  const y = 300 + r() * 80 + view * 20
  return (
    <g>
      <text x={-10 - view * 30} y={y} fill="#fff" fontFamily="Archivo, sans-serif" fontWeight={900} fontSize={label.length > 2 ? 230 : 330} style={{ fontVariationSettings: '"wdth" 62' }} letterSpacing={-8}>
        {label}
      </text>
      <rect x={40} y={y - 120 - r() * 60} width={W - 80} height={34} fill={RED} />
      <line x1={40} y1={60} x2={W - 40} y2={60} stroke="#fff" />
      <rect x={40} y={74} width={120} height={6} fill="#666" />
      <rect x={40} y={86} width={80} height={6} fill="#444" />
    </g>
  )
}

function Stack({ r, label }: { r: () => number; label: string }) {
  const n = 6
  const off = 14 + r() * 6
  return (
    <g>
      {Array.from({ length: n }).map((_, i) => {
        const x = 70 + i * off
        const y = 90 + i * off
        const last = i === n - 1
        return <rect key={i} x={x} y={y} width={W - 200} height={H - 260} fill={last ? '#050505' : '#0d0d0d'} stroke={last ? '#fff' : '#333'} />
      })}
      <text x={70 + (n - 1) * off + 24} y={90 + (n - 1) * off + 140} fill="#fff" fontFamily="Archivo, sans-serif" fontWeight={900} fontSize={label.length > 2 ? 64 : 110} style={{ fontVariationSettings: '"wdth" 125' }} letterSpacing={-4}>
        {label}
      </text>
      <rect x={70 + (n - 1) * off + 24} y={90 + (n - 1) * off + 170} width={90} height={14} fill={RED} />
    </g>
  )
}

function ProductArtBase({ kind, seed, label, code, view = 0, className }: Props) {
  const r = rng(seed * 7 + view * 31)
  const clip = useId()
  const zoom = [1, 1.35, 1.7, 1.15][view % 4]
  const ox = [0, -60, -140, -20][view % 4]
  const oy = [0, -40, -120, -30][view % 4]
  let content: ReactElement
  switch (kind) {
    case 'grid': content = <Grid r={r} view={view} />; break
    case 'frame': content = <Frame r={r} seed={seed} />; break
    case 'curve': content = <Curve r={r} view={view} />; break
    case 'mesh': content = <Mesh r={r} view={view} />; break
    case 'terminal': content = <Terminal r={r} label={label} />; break
    case 'type': content = <TypeCover r={r} label={label} view={view} />; break
    default: content = <Stack r={r} label={label} />
  }
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={className} role="img" aria-label={`${label} cover artwork`} preserveAspectRatio="xMidYMid slice">
      <defs>
        <clipPath id={clip}><rect width={W} height={H} /></clipPath>
      </defs>
      <rect width={W} height={H} fill="#0a0a0a" />
      <g clipPath={`url(#${clip})`}>
        <g transform={`translate(${ox} ${oy}) scale(${zoom})`}>{content}</g>
      </g>
      {code && (
        <text x={20} y={H - 20} fill="#888" fontFamily="JetBrains Mono, monospace" fontSize={11} letterSpacing={1}>
          {code}
        </text>
      )}
    </svg>
  )
}

export const ProductArt = memo(ProductArtBase)
