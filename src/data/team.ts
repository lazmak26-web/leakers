/**
 * Everything the team will want to edit lives in this file:
 * contact details, members, services, track record.
 * Replace the placeholder values marked with  ← EDIT  before going public.
 */

export const site = {
  name: 'LEAKERS',
  tagline: 'Offensive security team',
  email: 'contact@leakers.team', // ← EDIT: your real contact address
  location: 'Morocco · working remotely worldwide', // ← EDIT
  pgp: '7F3A 91C2 0E5D 44B8 A1F0  6C2E 9D13 5B70 2A4E 8C11', // ← EDIT: your real PGP fingerprint or remove
  socials: [
    { label: 'GitHub', href: 'https://github.com/lazmak26-web' },
    { label: 'X', href: 'https://x.com' }, // ← EDIT
    { label: 'LinkedIn', href: 'https://linkedin.com' }, // ← EDIT
    { label: 'Discord', href: 'https://discord.com' }, // ← EDIT
  ],
}

export interface Service {
  id: string
  title: string
  body: string
  scope: string[]
}

export const services: Service[] = [
  {
    id: 'pentest',
    title: 'Penetration testing',
    body: 'We attack your web apps, APIs and networks the way a real adversary would, then show you exactly how we got in.',
    scope: ['Web & API', 'Internal / external network', 'Mobile apps'],
  },
  {
    id: 'redteam',
    title: 'Red teaming',
    body: 'Goal-based operations that test people, process and detection together, not just a list of CVEs.',
    scope: ['Phishing simulation', 'Initial access', 'Detection testing'],
  },
  {
    id: 'audit',
    title: 'Code & cloud audit',
    body: 'Source review and cloud configuration audits that find the bugs scanners miss: logic flaws, broken access control, leaked secrets.',
    scope: ['Secure code review', 'AWS / Azure / GCP', 'CI/CD pipelines'],
  },
  {
    id: 'training',
    title: 'Training & CTF',
    body: 'Hands-on workshops and custom CTF events that teach your developers to think like attackers.',
    scope: ['Developer workshops', 'Custom CTF events', 'Awareness sessions'],
  },
]

export const process = [
  { title: 'Scope', body: 'We agree on targets, rules of engagement and a signed authorisation. Nothing is touched before that.' },
  { title: 'Recon', body: 'We map your attack surface: domains, endpoints, exposed services, people and technology.' },
  { title: 'Exploit', body: 'We chain vulnerabilities to prove real impact, safely and inside the agreed scope.' },
  { title: 'Report', body: 'You get a clear report: severity, proof, business impact and a fix for every finding.' },
  { title: 'Retest', body: 'Once you patch, we test again for free and confirm every issue is closed.' },
]

export interface Member {
  handle: string
  role: string
  focus: string[]
  certs?: string
}

// ← EDIT: replace with your real team handles, roles and certifications
export const members: Member[] = [
  { handle: 'n0ctis', role: 'Team lead · Red team', focus: ['Active Directory', 'Initial access', 'C2'], certs: 'OSCP · CRTO' },
  { handle: 'r3dshift', role: 'Web & API security', focus: ['Access control', 'SSRF', 'Auth flows'], certs: 'OSWE · BSCP' },
  { handle: 'gh0stbyte', role: 'Reverse engineering', focus: ['Binary exploitation', 'Malware analysis', 'Firmware'] },
  { handle: 'zer0trace', role: 'Cloud security', focus: ['AWS', 'Kubernetes', 'IAM abuse'], certs: 'AWS Security' },
  { handle: 'm4rrow', role: 'OSINT & social engineering', focus: ['Recon', 'Phishing sims', 'Attack surface'] },
]

// ← EDIT: replace with your real numbers
export const stats = [
  { value: '120+', label: 'assessments delivered' },
  { value: '40+', label: 'CTF competitions played' },
  { value: '300+', label: 'vulnerabilities reported' },
  { value: '0', label: 'tests without written authorisation' },
]

// ← EDIT: replace with your real results (competition, year, placing)
export const record = [
  { year: '2026', event: 'National CTF finals', result: 'Top 3' },
  { year: '2026', event: 'Bug bounty programs', result: 'Hall of fame ×12' },
  { year: '2025', event: 'Regional university CTF', result: '1st place' },
  { year: '2025', event: 'Online jeopardy CTFs', result: 'Top 50 worldwide' },
]
