import { notifications } from '../../data/applications'

export default function JobSeekerNotificationsPage() {
  return (
    <div className="space-y-6">
      <div className="card-surface p-6">
        <h1 className="text-3xl font-bold text-slate-900">Notifications</h1>
        <div className="mt-6 space-y-3">
          {notifications.map((notification) => (
            <div key={notification.id} className="rounded-2xl border border-slate-200 p-4">
              <div className="font-semibold text-slate-900">{notification.title}</div>
              <div className="mt-1 text-sm text-slate-600">{notification.description}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
