export default function Badge({ children, tone = 'blue', className = '' }) {
  const tones = {
    blue: 'bg-[#f2ddd5] text-[#a9472f]',
    green: 'bg-[#e3ece4] text-[#3f765b]',
    amber: 'bg-[#f1e8d2] text-[#8b6422]',
    slate: 'bg-[#ebe8e1] text-[#4c514b]',
    red: 'bg-[#f3dfdb] text-[#9b4335]',
  }

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${tones[tone]} ${className}`}>
      {children}
    </span>
  )
}
