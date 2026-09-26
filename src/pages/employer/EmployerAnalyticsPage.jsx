export default function EmployerAnalyticsPage() {
  return (
    <div className="space-y-10">
      <header className="max-w-2xl">
        <p className="text-sm font-cls
        bold uppercase tracking-[0.18em] text-[#a9472f]">Employer workspace</p>
        <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-slate-900">Analytics</h1>
        <p className="mt-4 text-base leading-8 text-slate-600">
          Understand how your roles are performing and where qualified candidates are finding you.
        </p>
      </header>

      <section className="card-surface min-h-64 p-7 md:p-9">
        <h2 className="text-xl font-bold text-slate-900">Hiring activity</h2>
        <p className="mt-3 max-w-xl text-sm leading-7 text-slate-600">
          Your hiring insights will appear here once your first role has received activity.
        </p>
      </section>
    </div>
  )
}
