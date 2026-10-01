import crypto from 'node:crypto'
import bcrypt from 'bcryptjs'
import { SignJWT, jwtVerify } from 'jose'
import { prisma } from './prisma'
import { forbidden, unauthorized } from './http'

const TOKEN_TTL = process.env.JWT_EXPIRES_IN || '7d'

function secretKey() {
  const secret = process.env.JWT_SECRET
  if (!secret || secret.length < 32) {
    throw new Error('JWT_SECRET must be set and at least 32 characters long')
  }
  return new TextEncoder().encode(secret)
}

export const hashPassword = (password) => bcrypt.hash(password, 12)
export const verifyPassword = (password, hash) => bcrypt.compare(password, hash)

export async function signAccessToken(user) {
  return new SignJWT({ role: user.role })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime(TOKEN_TTL)
    .sign(secretKey())
}

function readBearer(request) {
  const header = request.headers.get('authorization') || ''
  const [scheme, token] = header.split(' ')
  return scheme?.toLowerCase() === 'bearer' && token ? token : null
}

/** Returns the signed-in user, or null when the request has no valid token. */
export async function getAuthUser(request) {
  const token = readBearer(request)
  if (!token) return null
  try {
    const { payload } = await jwtVerify(token, secretKey())
    const user = await prisma.user.findUnique({ where: { id: payload.sub } })
    if (!user || user.status === 'SUSPENDED') return null
    return user
  } catch {
    return null
  }
}

/** Throws 401/403 unless the request is signed in (and has one of `roles`, if given). */
export async function requireAuth(request, roles = []) {
  const user = await getAuthUser(request)
  if (!user) throw unauthorized()
  if (roles.length > 0 && !roles.includes(user.role)) throw forbidden()
  return user
}

// One-time tokens (password reset, email verification). Only a hash is stored.
export const hashToken = (token) => crypto.createHash('sha256').update(token).digest('hex')

export async function createOneTimeToken(userId, type, ttlMinutes = 60) {
  const token = crypto.randomBytes(32).toString('hex')
  await prisma.authToken.create({
    data: { userId, type, tokenHash: hashToken(token), expiresAt: new Date(Date.now() + ttlMinutes * 60_000) },
  })
  return token
}

export async function consumeOneTimeToken(token, type) {
  const record = await prisma.authToken.findUnique({ where: { tokenHash: hashToken(token) } })
  if (!record || record.type !== type || record.usedAt || record.expiresAt < new Date()) return null
  await prisma.authToken.update({ where: { id: record.id }, data: { usedAt: new Date() } })
  return record
}
