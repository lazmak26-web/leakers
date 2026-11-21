// Production server: static files from dist/, SPA fallback, strict security headers.
// No dependencies, so nothing extra to keep patched.
import { createReadStream } from 'node:fs'
import { stat } from 'node:fs/promises'
import { createServer } from 'node:http'
import { extname, join, normalize, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(fileURLToPath(new URL('.', import.meta.url)), 'dist')
const PORT = Number(process.env.PORT) || 3000

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '': 'text/plain; charset=utf-8', // extensionless files, e.g. /.well-known/discord
}

const SECURITY = {
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self'",
    "style-src 'self' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data:",
    "connect-src 'self'",
    "media-src 'none'",
    "object-src 'none'",
    "frame-src 'none'",
    "worker-src 'none'",
    "manifest-src 'self'",
    "base-uri 'none'",
    "form-action 'none'",
    "frame-ancestors 'none'",
    'upgrade-insecure-requests',
  ].join('; '),
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'no-referrer',
  'Permissions-Policy': 'accelerometer=(), autoplay=(), camera=(), display-capture=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), midi=(), payment=(), usb=(), browsing-topics=()',
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Resource-Policy': 'same-origin',
  'X-Permitted-Cross-Domain-Policies': 'none',
  'X-DNS-Prefetch-Control': 'off',
}

const cacheFor = (urlPath) =>
  urlPath.startsWith('/assets/') ? 'public, max-age=31536000, immutable'
  : urlPath.startsWith('/products/') ? 'public, max-age=300'
  : 'no-cache'

/** Resolve a request path to a file inside ROOT, or null. Blocks traversal and directory reads. */
async function resolveFile(urlPath) {
  let decoded
  try { decoded = decodeURIComponent(urlPath) } catch { return null }
  if (decoded.includes('\0')) return null
  const full = normalize(join(ROOT, decoded))
  if (full !== ROOT && !full.startsWith(ROOT + sep)) return null
  try {
    const s = await stat(full)
    return s.isFile() ? { path: full, size: s.size } : null
  } catch { return null }
}

function send(res, status, file, urlPath, method) {
  res.writeHead(status, {
    ...SECURITY,
    'Content-Type': TYPES[extname(file.path).toLowerCase()] ?? 'application/octet-stream',
    'Content-Length': file.size,
    'Cache-Control': cacheFor(urlPath),
  })
  if (method === 'HEAD') return res.end()
  createReadStream(file.path).on('error', () => res.destroy()).pipe(res)
}

const server = createServer(async (req, res) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.writeHead(405, { ...SECURITY, Allow: 'GET, HEAD', 'Content-Type': 'text/plain' })
    return res.end('Method Not Allowed')
  }
  const urlPath = (req.url ?? '/').split('?')[0].split('#')[0] || '/'
  const file = urlPath === '/' ? null : await resolveFile(urlPath)
  if (file) return send(res, 200, file, urlPath, req.method)

  // Missing static asset → real 404; anything else → the single-page app.
  if (/^\/(assets|products)\//.test(urlPath) || /\.[a-z0-9]{2,5}$/i.test(urlPath)) {
    res.writeHead(404, { ...SECURITY, 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-cache' })
    return res.end('Not found')
  }
  const index = await resolveFile('/index.html')
  if (!index) { res.writeHead(500); return res.end() }
  send(res, 200, index, '/', req.method)
})

server.headersTimeout = 15_000
server.requestTimeout = 30_000
server.listen(PORT, '0.0.0.0', () => console.log(`LEAKERS listening on :${PORT}`))
