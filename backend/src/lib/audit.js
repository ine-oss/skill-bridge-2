import { notificationEmail } from './mailer'
import { prisma } from './prisma'

/** Records an audit entry. Never throws — auditing must not break the request. */
export async function audit(actorId, action, { entity, entityId, meta } = {}) {
  try {
    await prisma.auditLog.create({ data: { actorId, action, entity, entityId, meta } })
  } catch (error) {
    console.error('audit log failed', error)
  }
}

/**
 * Creates an in-app notification and, if the user has email notifications on, emails it too.
 * Never throws.
 */
export async function notify(userId, { title, description, type = 'SYSTEM', link }) {
  try {
    await prisma.notification.create({ data: { userId, title, description, type, link } })
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { email: true, emailNotifications: true, status: true } })
    if (user?.emailNotifications && user.status !== 'SUSPENDED' && process.env.EMAIL_NOTIFICATIONS !== 'false') {
      await notificationEmail(user.email, { title, description, link })
    }
  } catch (error) {
    console.error('notification failed', error)
  }
}
