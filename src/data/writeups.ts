export interface Writeup {
  slug: string
  title: string
  summary: string
  tag: 'Web' | 'Cloud' | 'Auth'
  date: string
  read: string
  body: { h?: string; p?: string; code?: string }[]
}

/** Educational write-ups. All examples run against lab targets we own. */
export const writeups: Writeup[] = [
  {
    slug: 'idor-multi-tenant-api',
    title: 'Finding IDOR in a multi-tenant API',
    summary: 'Why changing one number in a request is still one of the most common critical bugs, and how to stop it at the framework level.',
    tag: 'Web',
    date: '2026-10-28',
    read: '6 min',
    body: [
      { p: 'Insecure direct object references (IDOR) happen when an API trusts an identifier sent by the client without checking that the caller owns the object. In multi-tenant products the impact is usually cross-customer data access.' },
      { h: 'Spotting it' },
      { p: 'Log in as two users in two different tenants. Perform every action with user A, capture the requests, then replay them with user B\'s session. Any response that returns A\'s data is a finding.' },
      { code: 'GET /api/v2/invoices/48213\nAuthorization: Bearer <token of user B>\n\nHTTP/1.1 200 OK\n{"id":48213,"tenant":"acme","total":1890.00}' },
      { h: 'Fixing it properly' },
      { p: 'Per-endpoint checks get forgotten. Scope every query by tenant in one place: a repository layer or query middleware that always adds the caller\'s tenant to the WHERE clause, so a missing check fails closed.' },
      { code: '// every lookup goes through the scoped repository\nconst invoice = await invoices.forTenant(req.user.tenantId).findById(id)\nif (!invoice) return res.status(404).end()' },
      { p: 'Return 404 rather than 403 for objects outside the tenant, so attackers cannot enumerate which IDs exist.' },
    ],
  },
  {
    slug: 'ssrf-cloud-metadata',
    title: 'From SSRF to cloud credentials',
    summary: 'A URL preview feature, an internal metadata endpoint and the one setting that stops the whole chain.',
    tag: 'Cloud',
    date: '2026-09-14',
    read: '7 min',
    body: [
      { p: 'Server-side request forgery (SSRF) lets an attacker make your server send requests on their behalf. On cloud hosts the classic target is the instance metadata service, which can hand out temporary credentials.' },
      { h: 'The chain in our lab' },
      { p: 'A "link preview" endpoint fetched any URL the user supplied. Pointing it at the link-local metadata address returned the role name, then the role\'s temporary keys.' },
      { code: 'POST /api/preview\n{"url":"http://169.254.169.254/latest/meta-data/iam/security-credentials/"}' },
      { h: 'Defences, in order of impact' },
      { p: '1. Enforce IMDSv2 (session tokens required), which blocks simple GET-based SSRF from reaching credentials. 2. Resolve the hostname server-side and reject private, loopback and link-local ranges, after redirects too. 3. Give the instance role the least privilege it needs, so stolen keys are worth little.' },
    ],
  },
  {
    slug: 'jwt-algorithm-confusion',
    title: 'JWT algorithm confusion, explained',
    summary: 'How a library that trusts the token\'s own "alg" header lets attackers sign their own admin tokens.',
    tag: 'Auth',
    date: '2026-08-02',
    read: '5 min',
    body: [
      { p: 'A JSON Web Token declares its signing algorithm in its header. If the server lets the token choose, an attacker can switch from RS256 (asymmetric) to HS256 (symmetric) and sign the token with the server\'s public key as the HMAC secret.' },
      { h: 'Testing for it' },
      { p: 'Take a valid token, change the header to HS256, edit the payload (for example role: admin), and sign it using the public key the server exposes. If the API accepts it, verification is broken.' },
      { code: '{"alg":"HS256","typ":"JWT"}.{"sub":"1042","role":"admin"}' },
      { h: 'The fix' },
      { p: 'Pin the expected algorithm on the server and never read it from the token. Most libraries accept an explicit allow-list.' },
      { code: "jwt.verify(token, publicKey, { algorithms: ['RS256'] })" },
    ],
  },
]

export const writeupBySlug = (slug: string) => writeups.find((w) => w.slug === slug)
