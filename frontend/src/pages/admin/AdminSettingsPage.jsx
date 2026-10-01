import AccountSettings from '../../components/account/AccountSettings'

export default function AdminSettingsPage() {
  return (
    <div className="card-surface p-6">
      <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
      <div className="mt-6"><AccountSettings /></div>
    </div>
  )
}
