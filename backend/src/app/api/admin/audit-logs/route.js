import { requireAuth } from '@/lib/auth'
import { getPagination, handler, ok, paginated } from '@/lib/http'
import { prisma } from '@/lib/prisma'

// Query: action (prefix, e.g. "job."), actorId, page, limit
export const GET = handler(async (request) => {
  await requireAuth(request, ['admin'])
  const params = new URL(request.url).searchParams
  const pagination = getPagination(params, { defaultLimit: 50, maxLimit: 200 })
  const where = {}
  if (params.get('action')) where.action = { startsWith: params.get('action') }
  if (params.get('actorId')) where.actorId = params.get('actorId')

  const [logs, total] = await Promise.all([
    prisma.auditLog.findMany({
      where,
      include: { actor: { select: { id: true, name: true, email: true, role: true } } },
      orderBy: { createdAt: 'desc' },
      skip: pagination.skip,
      take: pagination.take,
    }),
    prisma.auditLog.count({ where }),
  ])
  return ok(paginated(logs, total, pagination))
})
