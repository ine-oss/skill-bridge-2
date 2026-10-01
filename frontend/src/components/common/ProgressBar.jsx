export default function ProgressBar({ value, className = '', label }) {
  return (
    <div className={`w-full ${className}`}>
      {label && <div className="mb-1 flex justify-between text-xs font-medium text-slate-600"><span>{label}</span><span>{value}%</span></div>}
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-200">
        <div
          className="h-full rounded-full bg-gradient-to-r from-blue-500 to-emerald-500"
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        />
      </div>
    </div>
  )
}
