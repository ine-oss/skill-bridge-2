import crypto from 'node:crypto'
import { audit, notify } from '@/lib/audit'
import { requireAuth } from '@/lib/auth'
import { forbidden, handler, notFound, ok, readJson } from '@/lib/http'
import { prisma } from '@/lib/prisma'
import { updateEnrollmentSchema } from '@/lib/validators'

// Learners update their own progress; providers can update learners in their programs.
// Reaching COMPLETED (or 100%) issues a certificate when the program offers one.
export const PATCH = handler(async (request, { params }) => {
  const user = await requireAuth(request, ['jobseeker', 'training', 'admin'])
  const enrollment = await prisma.enrollment.findUnique({ where: { id: params.id }, include: { program: { include: { provider: true } }, certificate: true } })
  if (!enrollment) throw notFound('Enrollment not found')
  const isLearner = enrollment.userId === user.id
  const isProvider = enrollment.program.provider.ownerId === user.id
  if (!isLearner && !isProvider && user.role !== 'admin') throw forbidden()

  const data = await readJson(request, updateEnrollmentSchema)
  // Learners can report progress or drop out; only the provider (or an admin) marks completion,
  // so certificates can't be self-issued.
  if (isLearner && !isProvider && user.role !== 'admin') {
    if (data.status && data.status !== 'DROPPED' && data.status !== 'IN_PROGRESS') throw forbidden('Your training provider confirms completion')
    if (data.progress !== undefined) data.progress = Math.min(data.progress, 99)
  }
  if (data.progress === 100 && !data.status) data.status = 'COMPLETED'
  if (data.progress > 0 && data.progress < 100 && !data.status && enrollment.status === 'ENROLLED') data.status = 'IN_PROGRESS'
  if (data.status === 'COMPLETED') {
    data.progress = 100
    data.completedAt = enrollment.completedAt || new Date()
  }

  const updated = await prisma.enrollment.update({ where: { id: enrollment.id }, data, include: { certificate: true } })

  if (updated.status === 'COMPLETED' && enrollment.program.certificate && !enrollment.certificate) {
    const code = `SB-${crypto.randomBytes(4).toString('hex').toUpperCase()}`
    updated.certificate = await prisma.certificate.create({ data: { code, enrollmentId: enrollment.id } })
    await notify(enrollment.userId, {
      title: 'Certificate issued',
      description: `You earned a certificate for ${enrollment.program.title} (${code})`,
      type: 'TRAINING',
      link: '/jobseeker/training',
    })
  }
  await audit(user.id, 'enrollment.update', { entity: 'Enrollment', entityId: enrollment.id, meta: data })
  return ok({ enrollment: updated })
})
