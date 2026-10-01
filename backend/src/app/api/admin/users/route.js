import { requireAuth } from '@/lib/auth'
import { getPagination, handler, ok, paginated } from '@/lib/http'
import { prisma } from '@/lib/prisma'
import { serializeUser } from '@/lib/serializers'

// Query: q, role, status, page, limit
export const GET = handler(async (request) => {
  await requireAuth(request, ['admin'])
  const params = new URL(request.url).searchParams
  const pagination = getPagination(params)
  const where = {}
  if (params.get('q')) {
    where.OR = [
      { name: { contains: params.get('q'), mode: 'insensitive' } },
      { email: { contains: params.get('q'), mode: 'insensitive' } },
    ]
  }
  if (params.get('role')) where.role = params.get('role')
  if (params.get('status')) where.status = params.get('status')

  const [users, total] = await Promise.all([
    prisma.user.findMany({ where, orderBy: { createdAt: 'desc' }, skip: pagination.skip, take: pagination.take }),
    prisma.user.count({ where }),
  ])
  return ok(paginated(users.map(serializeUser), total, pagination))
})
