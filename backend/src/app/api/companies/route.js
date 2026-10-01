import { getPagination, handler, ok, paginated } from '@/lib/http'
import { prisma } from '@/lib/prisma'

// Public company directory. Query: q, industry, verified=true, page, limit.
export const GET = handler(async (request) => {
  const params = new URL(request.url).searchParams
  const pagination = getPagination(params)
  const where = {}
  if (params.get('q')) where.name = { contains: params.get('q'), mode: 'insensitive' }
  if (params.get('industry')) where.industry = { equals: params.get('industry'), mode: 'insensitive' }
  if (params.get('verified') === 'true') where.verified = true

  const [companies, total] = await Promise.all([
    prisma.company.findMany({
      where,
      include: { _count: { select: { jobs: { where: { status: 'ACTIVE' } } } } },
      orderBy: [{ verified: 'desc' }, { name: 'asc' }],
      skip: pagination.skip,
      take: pagination.take,
    }),
    prisma.company.count({ where }),
  ])
  const items = companies.map(({ _count, ownerId: _ownerId, ...company }) => ({ ...company, jobs: _count.jobs }))
  return ok(paginated(items, total, pagination))
})
