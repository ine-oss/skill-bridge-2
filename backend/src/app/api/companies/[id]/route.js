import { handler, notFound, ok } from '@/lib/http'
import { jobInclude } from '@/lib/includes'
import { prisma } from '@/lib/prisma'
import { serializeJob } from '@/lib/serializers'

// `id` may be the company id or its slug.
export const GET = handler(async (request, { params }) => {
  const company = await prisma.company.findFirst({
    where: { OR: [{ id: params.id }, { slug: params.id }] },
    include: { jobs: { where: { status: 'ACTIVE' }, include: jobInclude, orderBy: { createdAt: 'desc' } } },
  })
  if (!company) throw notFound('Company not found')
  const { jobs, ownerId: _ownerId, ...rest } = company
  return ok({ company: { ...rest, jobs: jobs.map(serializeJob) } })
})
