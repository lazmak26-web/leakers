import { site } from '../data/team'
import { Link } from 'react-router-dom'
import { Logo } from './Navbar'

export function Footer() {
  const a = 'link-wipe w-fit text-paper/90 hover:text-paper'
  return (
    <footer className="relative z-10 border-t border-line bg-void">
      <div className="shell flex flex-col justify-between gap-10 py-14 md:flex-row md:items-end">
        <div>
          <Logo className="text-3xl" />
          <p className="mt-5 max-w-sm text-sm text-mute">Ethical hacking team. We only test systems with written authorisation from their owner.</p>
        </div>
        <nav className="flex gap-8 text-sm" aria-label="Footer">
          <Link className={a} to="/shop">Shop</Link>
          {site.socials.map((s) => <a key={s.label} className={a} href={s.href} target="_blank" rel="noreferrer noopener">{s.label}</a>)}
        </nav>
      </div>
      <div className="overflow-hidden">
        <p aria-hidden className="display select-none whitespace-nowrap text-[23vw] leading-[0.75] text-coal -mb-[0.06em] -ml-[0.04em]">LEAKERS</p>
      </div>
      <div className="shell border-t border-line py-6 font-mono text-xs text-mute">© {new Date().getFullYear()} LEAKERS</div>
    </footer>
  )
}
