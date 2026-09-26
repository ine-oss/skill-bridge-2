import Button from '../../components/common/Button'

export default function EmployerPostJobPage() {
  return (
    <div className="card-surface p-6">
      <h1 className="text-3xl font-bold text-slate-900">Post job</h1>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div><label className="field-label">Job title</label><input className="w-full rounded-xl border border-slate-200 px-3 py-2.5" /></div>
        <div><label className="field-label">Location</label><input className="w-full rounded-xl border border-slate-200 px-3 py-2.5" /></div>
        <div><label className="field-label">Employment type</label><select className="w-full rounded-xl border border-slate-200 px-3 py-2.5"><option>Full-time</option></select></div>
        <div><label className="field-label">Salary</label><input className="w-full rounded-xl border border-slate-200 px-3 py-2.5" /></div>
        <div className="md:col-span-2"><label className="field-label">Description</label><textarea className="w-full rounded-xl border border-slate-200 px-3 py-2.5" rows="4" /></div>
      </div>
      <div className="mt-6"><Button>Publish job</Button></div>
    </div>
  )
}
