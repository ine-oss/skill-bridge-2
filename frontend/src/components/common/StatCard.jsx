export default function StatCard({ title, value, subtitle, accent = 'blue' }) {
  const accentMap = {
    blue: 'bg-blue-50 text-blue-700',
    green: 'bg-emerald-50 text-emerald-700',
    amber: 'bg-amber-50 text-amber-700',
    slate: 'bg-slate-100 text-slate-700',
  }

  return (
    <div className="card-surface p-5">
      <div className={`mb-4 inline-flex rounded-xl px-3 py-2 text-sm font-semibold ${accentMap[accent]}`}>
        {title}
      </div>
      <div className="text-3xl font-bold text-slate-900">{value}</div>
      <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
    </div>
  )
}
