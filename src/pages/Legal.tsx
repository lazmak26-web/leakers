import { useEffect } from 'react'
import { Link, NavLink, useParams } from 'react-router-dom'
import { ButtonLink, EmptyState, PageHeader } from '../components/ui'

const pages: Record<string, { title: string; updated: string; sections: { h: string; p: string }[] }> = {
  terms: {
    title: 'Terms of sale', updated: 'November 1, 2026',
    sections: [
      { h: 'What you are buying', p: 'Every product on LEAKERS is a digital file or a licence key. Nothing is shipped. Your purchase gives you a licence to use the product as described on its page and in the licence terms.' },
      { h: 'Delivery', p: 'Download links are emailed to the address you enter at checkout and saved in your account as soon as payment is confirmed. Links do not expire for account holders.' },
      { h: 'Pricing and tax', p: 'Prices are listed in US dollars. Sales tax or VAT is calculated at checkout based on your location.' },
      { h: 'Updates', p: 'When a maker releases an update, it is free for existing buyers. We email you when an update is available.' },
    ],
  },
  privacy: {
    title: 'Privacy', updated: 'October 12, 2026',
    sections: [
      { h: 'What we collect', p: 'Your email, your order history and the minimum payment details our processor needs. We never see or store full card numbers.' },
      { h: 'What we do with it', p: 'We use your email to deliver files, send receipts and, if you opt in, our weekly newsletter. We do not sell or rent your data.' },
      { h: 'Cookies and storage', p: 'Your cart and wishlist are stored in your browser so they survive a refresh. We use no third-party advertising trackers.' },
      { h: 'Your rights', p: 'You can export or delete your account data at any time from your account page, or by contacting support.' },
    ],
  },
  licence: {
    title: 'Licences', updated: 'September 3, 2026',
    sections: [
      { h: 'Standard licence', p: 'Use the product in unlimited personal and client projects. You cannot resell or redistribute the source files, on their own or as part of another asset pack.' },
      { h: 'Team licences', p: 'Where a product is sold per seat, buy one licence for each person who opens the files. Quantity in the cart equals seats.' },
      { h: 'Fonts', p: 'Desktop licences cover installation on the buyer’s machines. Web use is limited to the number of domains stated on the product page.' },
      { h: 'Attribution', p: 'Not required, always appreciated.' },
    ],
  },
  refunds: {
    title: 'Refunds', updated: 'August 20, 2026',
    sections: [
      { h: '14-day guarantee', p: 'If a product does not work as described, contact us within 14 days of purchase and we will refund you in full.' },
      { h: 'How to ask', p: 'Reply to your receipt email with your order number and a short description of the problem. Most refunds are processed within two business days.' },
      { h: 'Exceptions', p: 'Limited bundles can be refunded only before any file in the bundle has been downloaded.' },
    ],
  },
}

export default function Legal() {
  const { page = '' } = useParams()
  const doc = pages[page]
  useEffect(() => { document.title = `${doc?.title ?? 'Not found'} — LEAKERS` }, [doc])
  if (!doc) return <div className="shell pt-40"><EmptyState title="Page not found." body="This legal page does not exist." action={<ButtonLink to="/legal/terms">Read the terms</ButtonLink>} /></div>
  return (
    <>
      <PageHeader title={doc.title} intro={`Last updated ${doc.updated}.`} />
      <div className="shell grid gap-10 md:grid-cols-12">
        <nav className="flex gap-4 overflow-x-auto text-sm md:col-span-3 md:flex-col md:gap-3" aria-label="Legal pages">
          {Object.entries(pages).map(([k, v]) => (
            <NavLink key={k} to={`/legal/${k}`} className={({ isActive }) => `whitespace-nowrap ${isActive ? 'text-paper' : 'text-mute hover:text-paper'}`}>{v.title}</NavLink>
          ))}
        </nav>
        <article className="max-w-2xl space-y-10 md:col-span-8">
          {doc.sections.map((s) => (
            <section key={s.h}>
              <h2 className="text-xl font-bold wide">{s.h}</h2>
              <p className="mt-3 leading-relaxed text-paper/75">{s.p}</p>
            </section>
          ))}
          <p className="border-t border-line pt-6 text-sm text-mute">Questions? Write to support from your <Link to="/account" className="link-wipe text-paper">account page</Link>.</p>
        </article>
      </div>
    </>
  )
}
