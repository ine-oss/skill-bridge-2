export default function Button({ children, variant = 'primary', className = '', type = 'button', ...props }) {
  const variants = {
    primary: 'bg-[#bd5639] text-white hover:bg-[#a9472f]',
    secondary: 'bg-slate-100 text-slate-900 hover:bg-slate-200',
    success: 'bg-emerald-600 text-white hover:bg-emerald-700',
    ghost: 'bg-transparent text-slate-700 hover:bg-slate-100',
    danger: 'bg-red-600 text-white hover:bg-red-700',
  }

  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-sm font-bold transition ${variants[variant]} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#bd5639] focus-visible:ring-offset-2 ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
