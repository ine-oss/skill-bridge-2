import { audit } from '@/lib/audit'
import { getAuthUser, requireAuth } from '@/lib/auth'
import { canReadFile } from '@/lib/files'
import { forbidden, handler, noContent, notFound } from '@/lib/http'
import { prisma } from '@/lib/prisma'

/**
 * Download a file. Logos and avatars are public; CVs, evidence and verification documents
 * need an Authorization header from someone allowed to see them (see lib/files.js).
 * Add ?download=1 to force a download instead of opening in the browser.
 */
export const GET = handler(async (request, { params }) => {
  const file = await prisma.fileUpload.findUnique({ where: { id: params.id } })
  if (!file) throw notFound('File not found')
  const user = await getAuthUser(request)
  if (!(await canReadFile(user, file))) throw user ? forbidden() : notFound('File not found')

  const download = new URL(request.url).searchParams.get('download') === '1'
  const safeName = file.filename.replace(/"/g, '')
  return new Response(file.data, {
    headers: {
      'Content-Type': file.mimeType,
      'Content-Length': String(file.size),
      'Content-Disposition': `${download ? 'attachment' : 'inline'}; filename="${safeName}"`,
      'X-Content-Type-Options': 'nosniff',
      'Cache-Control': ['LOGO', 'AVATAR'].includes(file.purpose) ? 'public, max-age=86400' : 'private, no-store',
    },
  })
})

export const DELETE = handler(async (request, { params }) => {
  const user = await requireAuth(request)
  const file = await prisma.fileUpload.findUnique({ where: { id: params.id }, select: { id: true, ownerId: true, purpose: true } })
  if (!file) throw notFound('File not found')
  if (file.ownerId !== user.id && user.role !== 'admin') throw forbidden()
  await prisma.fileUpload.delete({ where: { id: file.id } })
  const url = `/api/files/${file.id}`
  if (file.purpose === 'CV') await prisma.jobSeekerProfile.updateMany({ where: { userId: file.ownerId, cvUrl: url }, data: { cvUrl: null } })
  if (file.purpose === 'LOGO') await prisma.company.updateMany({ where: { ownerId: file.ownerId, logoUrl: url }, data: { logoUrl: null } })
  if (file.purpose === 'AVATAR') await prisma.user.updateMany({ where: { id: file.ownerId, avatarUrl: url }, data: { avatarUrl: null } })
  await audit(user.id, 'file.delete', { entity: 'FileUpload', entityId: file.id })
  return noContent()
})
