import { Link } from 'react-router-dom'
import { site } from '../data/team'
import { Logo, useSectionNav } from './Navbar'

export function Footer() {
  const go = useSectionNav()
  const a = 'link-wipe w-fit text-paper/90 hover:text-paper'
  return (
    <footer className="border-t border-line">
      <div className="shell grid grid-cols-2 gap-x-6 gap-y-12 py-16 md:grid-cols-12">
        <div className="col-span-2 md:col-span-6">
          <Logo className="text-3xl" />
          <p className="mt-5 max-w-sm text-sm text-mute">
            Ethical hacking team. We only test systems with written authorisation from their owner, and we disclose responsibly.
          </p>
        </div>
        <nav className="flex flex-col gap-3 text-sm md:col-span-3" aria-label="Site">
          <button className={`${a} text-left`} onClick={() => go('services')}>Services</button>
          <button className={`${a} text-left`} onClick={() => go('team')}>Team</button>
          <Link className={a} to="/writeups">Write-ups</Link>
          <button className={`${a} text-left`} onClick={() => go('contact')}>Contact</button>
        </nav>
        <nav className="flex flex-col gap-3 text-sm md:col-span-3" aria-label="Social">
          {site.socials.map((s) => <a key={s.label} className={a} href={s.href} target="_blank" rel="noreferrer noopener">{s.label}</a>)}
        </nav>
      </div>
      <div className="overflow-hidden">
        <p aria-hidden className="display select-none whitespace-nowrap text-[23vw] leading-[0.75] text-coal -mb-[0.06em] -ml-[0.04em]">LEAKERS</p>
      </div>
      <div className="shell flex flex-col justify-between gap-2 border-t border-line py-6 font-mono text-xs text-mute md:flex-row">
        <span>© {new Date().getFullYear()} LEAKERS</span>
        <span>Found a bug in this site? Email {site.email}</span>
      </div>
    </footer>
  )
}
