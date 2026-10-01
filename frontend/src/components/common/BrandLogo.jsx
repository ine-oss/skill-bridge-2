import { BriefcaseBusiness } from 'lucide-react'

export default function BrandLogo() {
  return (
    <span className="inline-flex items-center gap-3" aria-label="Skill Bridge">
      <span className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-[#1769aa] text-white shadow-sm">
        <BriefcaseBusiness size={22} strokeWidth={2.2} />
        <span className="absolute bottom-0 left-0 h-1 w-1/3 rounded-bl-xl bg-[#00a85a]" />
        <span className="absolute bottom-0 left-1/3 h-1 w-1/3 bg-[#f4c430]" />
        <span className="absolute bottom-0 right-0 h-1 w-1/3 rounded-br-xl bg-[#00a85a]" />
      </span>
      <span className="flex flex-col text-left leading-tight">
        <span className="text-base font-extrabold text-slate-900">Skill Bridge</span>
        <span className="text-[11px] font-semibold text-slate-500">Opportunity starts here</span>
      </span>
    </span>
  )
}