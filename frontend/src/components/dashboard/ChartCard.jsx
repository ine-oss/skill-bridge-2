import { useState } from 'react'

/**
 * Card wrapper for a chart: title, optional legend, and a Chart/Table switch so every value
 * is reachable without hovering (and without relying on colour).
 *   legend: [{ label, color, shape: 'line' | 'rect' }]
 *   table:  { columns: ['Week', 'Applications'], rows: [['Jul 6', 3], …] }
 */
export default function ChartCard({ title, subtitle, legend, table, action, children, className = '' }) {
  const [view, setView] = useState('chart')
  return (
    <section className={`rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6 ${className}`}>
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-base font-semibold text-slate-900">{title}</h2>
          {subtitle && <p className="mt-0.5 text-sm text-slate-500">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-2">
          {action}
          {table && (
            <div className="flex rounded-lg bg-slate-100 p-0.5 text-xs font-medium" role="group" aria-label={`${title} view`}>
              {['chart', 'table'].map((mode) => (
                <button key={mode} type="button" aria-pressed={view === mode} onClick={() => setView(mode)} className={`rounded-md px-2.5 py-1 capitalize transition ${view === mode ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>{mode}</button>
              ))}
            </div>
          )}
        </div>
      </header>
      {legend?.length > 1 && view === 'chart' && (
        <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-600">
          {legend.map((item) => (
            <li key={item.label} className="inline-flex items-center gap-1.5">
              <span className={item.shape === 'line' ? 'h-0.5 w-3.5 rounded-full' : 'h-2.5 w-2.5 rounded-sm'} style={{ background: item.color }} aria-hidden="true" />
              {item.label}
            </li>
          ))}
        </ul>
      )}
      <div className="mt-4">
        {view === 'table' && table ? (
          <div className="max-h-80 overflow-auto">
            <table className="w-full text-left text-sm">
              <thead className="sticky top-0 bg-white text-xs text-slate-500"><tr>{table.columns.map((column, index) => <th key={column} className={`border-b border-slate-200 py-2 font-medium ${index ? 'text-right' : ''}`}>{column}</th>)}</tr></thead>
              <tbody>{table.rows.map((row, rowIndex) => <tr key={rowIndex} className="border-b border-slate-100 last:border-0">{row.map((cell, index) => <td key={index} className={`py-2 ${index ? 'text-right tabular-nums text-slate-700' : 'text-slate-700'}`}>{cell}</td>)}</tr>)}</tbody>
            </table>
          </div>
        ) : children}
      </div>
    </section>
  )
}
