import { audit } from '@/lib/audit'
import { createOneTimeToken, hashPassword, signAccessToken } from '@/lib/auth'
import { conflict, created, handler, readJson } from '@/lib/http'
import { frontendUrl, verificationEmail } from '@/lib/mailer'
import { prisma } from '@/lib/prisma'
import { serializeUser } from '@/lib/serializers'
import { uniqueSlug } from '@/lib/utils'
import { registerSchema } from '@/lib/validators'

export const POST = handler(async (request) => {
  const input = await readJson(request, registerSchema)

  const existing = await prisma.user.findUnique({ where: { email: input.email } })
  if (existing) throw conflict('An account with this email already exists')

  const passwordHash = await hashPassword(input.password)
  const base = { name: input.name, email: input.email, passwordHash, role: input.role }

  let user
  if (input.role === 'jobseeker') {
    user = await prisma.user.create({
      data: { ...base, jobSeekerProfile: { create: { location: input.location || null, profileCompletion: 20 } } },
    })
  } else if (input.role === 'employer') {
    const slug = await uniqueSlug('company', input.name)
    user = await prisma.user.create({
      data: { ...base, company: { create: { slug, name: input.name, contactName: input.contactName || null } } },
    })
  } else {
    const slug = await uniqueSlug('trainingProvider', input.name)
    user = await prisma.user.create({
      data: { ...base, trainingProvider: { create: { slug, name: input.name, pointOfContact: input.pointOfContact || null } } },
    })
  }

  const token = await signAccessToken(user)
  await audit(user.id, 'user.register', { entity: 'User', entityId: user.id, meta: { role: user.role } })
  await prisma.notification.create({ data: { userId: user.id, title: 'Welcome to Skill Bridge', description: 'Complete your profile to get the most out of the platform.', type: 'SYSTEM' } })
  const verifyToken = await createOneTimeToken(user.id, 'EMAIL_VERIFICATION', 60 * 24)
  await verificationEmail(user.email, user.name, `${frontendUrl()}/verify-email?token=${verifyToken}`)

  return created({ user: serializeUser(user), token })
})
