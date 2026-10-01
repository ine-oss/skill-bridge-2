import { audit, notify } from '@/lib/audit'
import { requireAuth } from '@/lib/auth'
import { badRequest, forbidden, handler, notFound, ok, readJson } from '@/lib/http'
import { applicationInclude } from '@/lib/includes'
import { prisma } from '@/lib/prisma'
import { serializeApplication } from '@/lib/serializers'
import { updateApplicationSchema } from '@/lib/validators'

async function load(id) {
  const application = await prisma.application.findUnique({ where: { id }, include: applicationInclude })
  if (!application) throw notFound('Application not found')
  return application
}

const isApplicant = (user, application) => application.applicantId === user.id
const isEmployer = (user, application) => application.job.company.ownerId === user.id

export const GET = handler(async (request, { params }) => {
  const user = await requireAuth(request)
  const application = await load(params.id)
  if (!isApplicant(user, application) && !isEmployer(user, application) && user.role !== 'admin') throw forbidden()
  return ok({ application: serializeApplication(application) })
})

/**
 * Employers (or admins) move an application through the pipeline.
 * Applicants may only withdraw their own application.
 */
export const PATCH = handler(async (request, { params }) => {
  const user = await requireAuth(request)
  const application = await load(params.id)
  const { status, note } = await readJson(request, updateApplicationSchema)

  if (isApplicant(user, application)) {
    if (status !== 'WITHDRAWN') throw forbidden('You can only withdraw your application')
  } else if (!isEmployer(user, application) && user.role !== 'admin') {
    throw forbidden()
  } else if (status === 'WITHDRAWN') {
    throw badRequest('Only the applicant can withdraw an application')
  }

  const updated = await prisma.application.update({
    where: { id: application.id },
    data: { status, events: { create: { status, note } } },
    include: applicationInclude,
  })

  await audit(user.id, 'application.status', { entity: 'Application', entityId: application.id, meta: { from: application.status, to: status } })
  if (isApplicant(user, application)) {
    await notify(application.job.company.ownerId, {
      title: 'Application withdrawn',
      description: `${application.applicant.name} withdrew from ${application.job.title}`,
      type: 'APPLICATION',
    })
  } else {
    await notify(application.applicantId, {
      title: 'Application status changed',
      description: `${application.job.company.name} updated your application for ${application.job.title} to ${status.toLowerCase()}`,
      type: 'APPLICATION',
      link: '/jobseeker/applications',
    })
  }
  return ok({ application: serializeApplication(updated) })
})
