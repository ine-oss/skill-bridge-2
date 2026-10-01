import { getAuthUser } from '@/lib/auth'
import { audit } from '@/lib/audit'
import { handler, noContent } from '@/lib/http'

// Tokens are stateless JWTs: the client discards its token. This endpoint only records the event.
export const POST = handler(async (request) => {
  const user = await getAuthUser(request)
  if (user) await audit(user.id, 'user.logout', { entity: 'User', entityId: user.id })
  return noContent()
})
