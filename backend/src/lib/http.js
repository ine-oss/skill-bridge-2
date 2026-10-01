import { NextResponse } from 'next/server'
import { ZodError } from 'zod'
import { Prisma } from '@/generated/prisma/client'

export class ApiError extends Error {
  constructor(status, message, details) {
    super(message)
    this.status = status
    this.details = details
  }
}

export const badRequest = (message = 'Bad request', details) => new ApiError(400, message, details)
export const unauthorized = (message = 'Authentication required') => new ApiError(401, message)
export const forbidden = (message = 'You do not have permission to do that') => new ApiError(403, message)
export const notFound = (message = 'Not found') => new ApiError(404, message)
export const conflict = (message = 'Already exists') => new ApiError(409, message)

export function ok(data, init) {
  return NextResponse.json(data, init)
}

export function created(data) {
  return NextResponse.json(data, { status: 201 })
}

export function noContent() {
  return new NextResponse(null, { status: 204 })
}

function toErrorResponse(error) {
  if (error instanceof ApiError) {
    return NextResponse.json({ error: error.message, details: error.details }, { status: error.status })
  }
  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        error: 'Validation failed',
        details: error.issues.map((issue) => ({ path: issue.path.join('.'), message: issue.message })),
      },
      { status: 422 },
    )
  }
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') return NextResponse.json({ error: 'A record with these details already exists' }, { status: 409 })
    if (error.code === 'P2025') return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
  if (error instanceof SyntaxError) {
    return NextResponse.json({ error: 'Request body must be valid JSON' }, { status: 400 })
  }
  console.error(error)
  return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
}

/**
 * Wraps a route handler so thrown errors become JSON responses.
 * Next.js 16 passes `params` as a Promise; it is resolved here for convenience.
 */
export function handler(fn) {
  return async (request, context = {}) => {
    try {
      const params = context.params ? await context.params : {}
      return await fn(request, { params })
    } catch (error) {
      return toErrorResponse(error)
    }
  }
}

export async function readJson(request, schema) {
  const text = await request.text()
  const body = text ? JSON.parse(text) : {}
  return schema ? schema.parse(body) : body
}

export function getPagination(searchParams, { defaultLimit = 20, maxLimit = 100 } = {}) {
  const page = Math.max(1, Number.parseInt(searchParams.get('page') || '1', 10) || 1)
  const limit = Math.min(maxLimit, Math.max(1, Number.parseInt(searchParams.get('limit') || String(defaultLimit), 10) || defaultLimit))
  return { page, limit, skip: (page - 1) * limit, take: limit }
}

export function paginated(items, total, { page, limit }) {
  return { data: items, meta: { page, limit, total, totalPages: Math.max(1, Math.ceil(total / limit)) } }
}
