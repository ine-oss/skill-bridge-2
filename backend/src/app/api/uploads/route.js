import { audit } from '@/lib/audit'
import { requireAuth } from '@/lib/auth'
import { MAX_UPLOAD_BYTES, UPLOAD_RULES, fileUrl } from '@/lib/files'
import { badRequest, created, forbidden, handler } from '@/lib/http'
import { prisma } from '@/lib/prisma'

/**
 * Upload a file as multipart/form-data with fields:
 *   file     — the file
 *   purpose  — CV | EVIDENCE | VERIFICATION | LOGO | AVATAR
 * Side effects: a CV becomes the job seeker's current CV, a LOGO the company logo, an AVATAR the user's photo.
 */
export const POST = handler(async (request) => {
  const user = await requireAuth(request)
  let form
  try {
    form = await request.formData()
  } catch {
    throw badRequest('Send the file as multipart/form-data')
  }
  const file = form.get('file')
  const purpose = String(form.get('purpose') || '').toUpperCase()
  const rule = UPLOAD_RULES[purpose]

  if (!rule) throw badRequest(`purpose must be one of ${Object.keys(UPLOAD_RULES).join(', ')}`)
  if (!rule.roles.includes(user.role)) throw forbidden('Your account type cannot upload this kind of file')
  if (!file || typeof file === 'string') throw badRequest('Attach a file in the "file" field')
  if (!rule.types.includes(file.type)) throw badRequest(`Please upload ${rule.label}`)
  if (file.size === 0) throw badRequest('The file is empty')
  if (file.size > MAX_UPLOAD_BYTES) throw badRequest(`Files must be smaller than ${Math.round(MAX_UPLOAD_BYTES / 1024 / 1024)} MB`)

  const data = Buffer.from(await file.arrayBuffer())
  const filename = (file.name || 'upload').replace(/[^\w.\- ()]+/g, '_').slice(0, 120)
  const saved = await prisma.fileUpload.create({
    data: { ownerId: user.id, purpose, filename, mimeType: file.type, size: file.size, data },
    select: { id: true, purpose: true, filename: true, mimeType: true, size: true, createdAt: true },
  })
  const url = fileUrl(saved.id)

  if (purpose === 'CV') {
    await prisma.jobSeekerProfile.upsert({ where: { userId: user.id }, update: { cvUrl: url }, create: { userId: user.id, cvUrl: url } })
  } else if (purpose === 'LOGO' && user.role === 'employer') {
    await prisma.company.updateMany({ where: { ownerId: user.id }, data: { logoUrl: url } })
  } else if (purpose === 'AVATAR') {
    await prisma.user.update({ where: { id: user.id }, data: { avatarUrl: url } })
  }

  await audit(user.id, 'file.upload', { entity: 'FileUpload', entityId: saved.id, meta: { purpose, size: file.size } })
  return created({ file: { ...saved, url } })
})
