import { messages } from '../../data/applications'

export default function JobSeekerMessagesPage() {
  return (
    <div className="space-y-6">
      <div className="card-surface p-6">
        <h1 className="text-3xl font-bold text-slate-900">Messages</h1>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {messages.map((thread) => (
            <div key={thread.id} className="rounded-2xl border border-slate-200 p-5">
              <div className="flex items-center justify-between">
                <div className="font-bold text-slate-900">{thread.name}</div>
                {thread.unread > 0 && <span className="rounded-full bg-blue-600 px-2 py-1 text-xs font-semibold text-white">{thread.unread}</span>}
              </div>
              <div className="mt-2 text-sm text-slate-600">{thread.preview}</div>
              <div className="mt-3 text-xs text-slate-500">{thread.time}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
