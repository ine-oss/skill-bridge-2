import Button from '../../components/common/Button'

export default function JobSeekerSettingsPage() {
  return (
    <div className="space-y-6">
      <div className="card-surface p-6">
        <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 p-5">
            <h2 className="text-lg font-bold text-slate-900">Account</h2>
            <div className="mt-4 space-y-3">
              <div>Email notifications enabled</div>
              <div>Profile visibility: Public</div>
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 p-5">
            <h2 className="text-lg font-bold text-slate-900">Security</h2>
            <div className="mt-4 space-y-3">
              <div>Two-factor authentication</div>
              <div>Password last changed 3 months ago</div>
            </div>
          </div>
        </div>
        <div className="mt-6 flex gap-3">
          <Button>Save changes</Button>
          <Button variant="secondary">Cancel</Button>
        </div>
      </div>
    </div>
  )
}
