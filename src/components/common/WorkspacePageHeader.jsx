import { Link } from 'react-router-dom'

export default function WorkspacePageHeader({ eyebrow, title, description, actionLabel, actionTo, icon: Icon }) {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow && <p className="text-sm font-semibold text-blue-700">{eyebrow}</p>}
        <h1 className="mt-1 text-3xl font-bold text-slate-900">{title}</h1>
        {description && <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">{description}</p>}
      </div>
      {actionLabel && actionTo && (
        <Link to={actionTo} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700">
          {Icon && <Icon size={17} />}{actionLabel}
        </Link>
      )}
    </header>
  )
}