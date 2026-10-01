import { requireAuth } from '@/lib/auth'
import { handler, ok } from '@/lib/http'
import { prisma } from '@/lib/prisma'

// Platform-wide numbers for the admin dashboard and analytics pages.
// Query: months (default 6, max 24)
export const GET = handler(async (request) => {
  await requireAuth(request, ['admin'])
  const monthsParam = Number(new URL(request.url).searchParams.get('months') || 6)
  const count = Math.min(24, Math.max(1, Number.isFinite(monthsParam) ? monthsParam : 6))

  const now = new Date()
  const start = new Date(now.getFullYear(), now.getMonth() - (count - 1), 1)
  const months = Array.from({ length: count }, (_, index) => {
    const date = new Date(start.getFullYear(), start.getMonth() + index, 1)
    return { key: `${date.getFullYear()}-${date.getMonth()}`, label: date.toLocaleString('en', { month: 'short', year: '2-digit' }), users: 0, jobs: 0, applications: 0, enrollments: 0 }
  })
  const bucket = (rows, field, dateField = 'createdAt') => {
    for (const row of rows) {
      const date = row[dateField]
      const month = months.find((item) => item.key === `${date.getFullYear()}-${date.getMonth()}`)
      if (month) month[field] += 1
    }
  }

  const since = { gte: start }
  const [users, jobs, applications, enrollments, applicationsByStatus, usersByRole, jobSkills] = await Promise.all([
    prisma.user.findMany({ where: { createdAt: since }, select: { createdAt: true } }),
    prisma.job.findMany({ where: { createdAt: since }, select: { createdAt: true } }),
    prisma.application.findMany({ where: { createdAt: since }, select: { createdAt: true } }),
    prisma.enrollment.findMany({ where: { enrolledAt: since }, select: { enrolledAt: true } }),
    prisma.application.groupBy({ by: ['status'], _count: true }),
    prisma.user.groupBy({ by: ['role'], _count: true }),
    prisma.jobSkill.groupBy({ by: ['skillId'], where: { job: { status: 'ACTIVE' } }, _count: true, orderBy: { _count: { skillId: 'desc' } }, take: 10 }),
  ])
  bucket(users, 'users')
  bucket(jobs, 'jobs')
  bucket(applications, 'applications')
  bucket(enrollments, 'enrollments', 'enrolledAt')

  const skills = await prisma.skill.findMany({ where: { id: { in: jobSkills.map((row) => row.skillId) } } })
  const skillName = Object.fromEntries(skills.map((skill) => [skill.id, skill.name]))

  return ok({
    months: months.map(({ key: _key, ...month }) => month),
    applicationsByStatus: Object.fromEntries(applicationsByStatus.map((row) => [row.status, row._count])),
    usersByRole: Object.fromEntries(usersByRole.map((row) => [row.role, row._count])),
    topSkills: jobSkills.map((row) => ({ skill: skillName[row.skillId], jobs: row._count })),
  })
})
