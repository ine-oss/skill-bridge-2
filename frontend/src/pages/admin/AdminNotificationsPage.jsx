import NotificationsList from '../../components/common/NotificationsList'

export default function AdminNotificationsPage() {
  return (
    <div className="card-surface p-6">
      <h1 className="text-3xl font-bold text-slate-900">Notifications</h1>
      <div className="mt-6"><NotificationsList /></div>
    </div>
  )
}
