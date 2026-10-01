import { NextResponse } from 'next/server'

// CORS for the React (Vite) frontend. Comma-separate multiple origins in CORS_ORIGINS.
// A "*" wildcard is allowed inside a host, e.g. https://skill-bridge-*.vercel.app for preview deployments.
const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim().replace(/\/$/, ''))
  .filter(Boolean)
const patterns = allowedOrigins.map((origin) => new RegExp(`^${origin.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '[a-z0-9-]+')}$`, 'i'))
const isAllowed = (origin) => patterns.some((pattern) => pattern.test(origin))

function corsHeaders(origin) {
  const headers = {
    'Access-Control-Allow-Methods': 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  }
  if (origin && isAllowed(origin)) headers['Access-Control-Allow-Origin'] = origin
  return headers
}

export function proxy(request) {
  const origin = request.headers.get('origin')

  if (request.method === 'OPTIONS') {
    return new NextResponse(null, { status: 204, headers: corsHeaders(origin) })
  }

  const response = NextResponse.next()
  for (const [key, value] of Object.entries(corsHeaders(origin))) response.headers.set(key, value)
  return response
}

export const config = {
  matcher: '/api/:path*',
}
