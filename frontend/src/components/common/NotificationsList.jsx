import { Link } from 'react-router-dom'
import AsyncState from './AsyncState'
import useApi from '../../hooks/useApi'
import { timeAgo } from '../../lib/format'
import { notificationService } from '../../services/communicationService'

/** Notification feed backed by /api/notifications, with mark-as-read. */
export default function NotificationsList({ limit }) {
  const { data, loading, error, reload, setData } = useApi(() => notificationService.getNotifications(), [])
  const items = (data?.data || []).slice(0, limit)

  const markRead = async (id) => {
    await notificationService.markRead(id)
    setData((current) => ({ ...current, unread: Math.max(0, current.unread - 1), data: current.data.map((item) => item.id === id ? { ...item, read: true } : item) }))
  }
  const markAllRead = async () => {
    await notificationService.markAllRead()
    setData((current) => ({ ...current, unread: 0, data: current.data.map((item) => ({ ...item, read: true })) }))
  }

  return (
    <AsyncState loading={loading} error={error} onRetry={reload} empty={items.length === 0} emptyTitle="You're all caught up" emptyText="New activity will show up here.">
      {!limit && data?.unread > 0 && (
        <div className="mb-3 flex justify-end"><button type="button" onClick={markAllRead} className="text-sm font-semibold text-blue-700 hover:text-blue-800">Mark all as read ({data.unread})</button></div>
      )}
      <div className="space-y-3">
        {items.map((notification) => (
          <div key={notification.id} className={`rounded-2xl border p-4 ${notification.read ? 'border-slate-200' : 'border-blue-200 bg-blue-50/40'}`}>
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="font-semibold text-slate-900">{notification.title}</div>
                <div className="mt-1 text-sm text-slate-600">{notification.description}</div>
                <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                  <span>{timeAgo(notification.createdAt)}</span>
                  {notification.link && <Link to={notification.link} className="font-semibold text-blue-700">Open</Link>}
                </div>
              </div>
              {!notification.read && <button type="button" onClick={() => markRead(notification.id)} className="shrink-0 text-xs font-semibold text-slate-500 hover:text-slate-800">Mark read</button>}
            </div>
          </div>
        ))}
      </div>
    </AsyncState>
  )
}
