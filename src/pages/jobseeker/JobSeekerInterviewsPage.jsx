export default function JobSeekerInterviewsPage() {
  return (
    <div className="space-y-6">
      <div className="card-surface p-6">
        <h1 className="text-3xl font-bold text-slate-900">Interviews</h1>
        <div className="mt-6 space-y-4">
          {[
            { title: 'Front-end technical interview', company: 'Northstar Labs', date: 'Thu, 20 Sep · 10:00 AM' },
            { title: 'Hiring manager call', company: 'BluePeak Analytics', date: 'Mon, 23 Sep · 2:00 PM' },
          ].map((item) => (
            <div key={item.title} className="rounded-2xl border border-slate-200 p-5">
              <div className="text-lg font-bold text-slate-900">{item.title}</div>
              <div className="mt-1 text-sm text-slate-600">{item.company}</div>
              <div className="mt-2 text-sm text-blue-700">{item.date}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
