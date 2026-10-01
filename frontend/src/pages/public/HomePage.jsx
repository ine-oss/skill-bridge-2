import { ArrowRight, CheckCircle2, GraduationCap, Search, TrendingUp, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import Button from '../../components/common/Button'
import JobCard from '../../components/cards/JobCard'
import CompanyCard from '../../components/cards/CompanyCard'
import TrainingCard from '../../components/cards/TrainingCard'
import useApi from '../../hooks/useApi'
import { toCompanyView, toJobView, toProgramView } from '../../lib/format'
import { companyService } from '../../services/companyService'
import { jobService } from '../../services/jobService'
import { trainingService } from '../../services/trainingService'

const processSteps = [
  { title: 'Discover', description: 'Explore roles and training aligned to your future goals.' },
  { title: 'Build Skills', description: 'Learn, practice, and collect evidence you can trust.' },
  { title: 'Prove Ability', description: 'Upload certificates, projects, and work samples.' },
  { title: 'Get Matched', description: 'Applicants are recommended to employers by skill fit.' },
]

export default function HomePage() {
  // The home page shows a few live items from each area; failures just leave a section empty.
  const jobsRequest = useApi(() => jobService.getJobs({ limit: 3 }), [])
  const companiesRequest = useApi(() => companyService.getCompanies({ limit: 3, verified: true }), [])
  const trainingRequest = useApi(() => trainingService.getPrograms({ limit: 3 }), [])
  const recommendedJobs = (jobsRequest.data?.data || []).map(toJobView)
  const companies = (companiesRequest.data?.data || []).map(toCompanyView)
  const trainingCatalog = (trainingRequest.data?.data || []).map(toProgramView)

  return (
    <div>
      <section className="border-b border-slate-200 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 md:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:py-24">
          <div>
            <span className="section-kicker bg-blue-500/20 text-blue-100">Skills-to-employment ecosystem</span>
            <h1 className="mt-6 max-w-xl text-4xl font-black tracking-tight md:text-6xl">
              Build Skills. Prove Your Skills. Find Opportunities.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-slate-300">
              Skill Bridge connects job seekers, employers, trainers, and administrators in one pathway from skill gap to employment.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/jobs"><Button className="bg-white text-slate-900 hover:bg-slate-100">Explore jobs</Button></Link>
              <Link to="/login"><Button variant="secondary" className="border border-white/20 bg-white/5 text-white hover:bg-white/10">Login</Button></Link>
            </div>

            <div className="mt-10 grid max-w-lg grid-cols-3 gap-4">
              <div>
                <div className="text-3xl font-bold text-white">12k+</div>
                <div className="text-sm text-slate-300">Learners</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white">350+</div>
                <div className="text-sm text-slate-300">Employers</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white">94%</div>
                <div className="text-sm text-slate-300">Placement rate</div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-sm">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-300">Job search</div>
                <h2 className="text-2xl font-bold text-white">Find your fit</h2>
              </div>
              <Search className="text-blue-300" />
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl bg-white/5 p-3 text-sm text-slate-200">
                <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Role</div>
                <div className="mt-2 font-medium text-white">Frontend Developer</div>
              </div>
              <div className="rounded-2xl bg-white/5 p-3 text-sm text-slate-200">
                <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Location</div>
                <div className="mt-2 font-medium text-white">Remote / Hybrid</div>
              </div>
              <div className="rounded-2xl bg-white/5 p-3 text-sm text-slate-200">
                <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Skills</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  <span className="rounded-full bg-blue-500/20 px-2.5 py-1 text-xs text-blue-200">React</span>
                  <span className="rounded-full bg-blue-500/20 px-2.5 py-1 text-xs text-blue-200">JavaScript</span>
                  <span className="rounded-full bg-blue-500/20 px-2.5 py-1 text-xs text-blue-200">UX</span>
                </div>
              </div>
              <Button className="w-full">Search opportunities</Button>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 md:px-6">
        <div className="mb-8 text-center">
          <span className="section-kicker">How it works</span>
          <h2 className="section-title mt-4">A guided skills-to-employment journey</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-4">
          {processSteps.map((step, index) => (
            <div key={step.title} className="card-surface p-6">
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 font-bold text-blue-700">
                0{index + 1}
              </div>
              <h3 className="text-xl font-bold text-slate-900">{step.title}</h3>
              <p className="mt-3 text-sm text-slate-600">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-slate-100 py-16">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <span className="section-kicker">Featured roles</span>
              <h2 className="section-title mt-4">Open opportunities for skilled talent</h2>
            </div>
            <Link to="/jobs" className="flex items-center gap-2 text-sm font-semibold text-blue-700">View all jobs <ArrowRight size={16} /></Link>
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            {recommendedJobs.map((job) => <JobCard key={job.id} job={job} />)}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 md:px-6">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <span className="section-kicker">Featured employers</span>
            <h2 className="section-title mt-4">Companies building tomorrow’s workforce</h2>
          </div>
          <Link to="/companies" className="flex items-center gap-2 text-sm font-semibold text-blue-700">View all companies <ArrowRight size={16} /></Link>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {companies.map((company) => <CompanyCard key={company.id} company={company} />)}
        </div>
      </section>

      <section className="bg-slate-100 py-16">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <span className="section-kicker">Learning pathways</span>
              <h2 className="section-title mt-4">Recommended training to close gaps</h2>
            </div>
            <Link to="/training" className="flex items-center gap-2 text-sm font-semibold text-blue-700">Explore training <ArrowRight size={16} /></Link>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {trainingCatalog.map((training) => <TrainingCard key={training.id} training={training} />)}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 md:px-6">
        <div className="mb-8 text-center">
          <span className="section-kicker">Why Skill Bridge</span>
          <h2 className="section-title mt-4">Built for growth, trust, and opportunity</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-4">
          {[
            { icon: TrendingUp, title: 'Skills-first matching', text: 'Roles are matched by demonstrated capability, not just degree history.' },
            { icon: CheckCircle2, title: 'Verified evidence', text: 'Projects, certificates, and portfolios make skills visible to employers.' },
            { icon: GraduationCap, title: 'Learning pathways', text: 'Get targeted coaching and training aligned to your target job.' },
            { icon: Users, title: 'Human support', text: 'Career guidance and community support reduce barriers to entry.' },
          ].map(({ icon: Icon, title, text }) => (
            <div key={title} className="card-surface p-6 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
                <Icon size={22} />
              </div>
              <h3 className="text-lg font-bold text-slate-900">{title}</h3>
              <p className="mt-3 text-sm text-slate-600">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-slate-900 py-16 text-white">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="grid gap-8 md:grid-cols-4">
            {[
              { value: '85%', label: 'Skill match success' },
              { value: '4.9/5', label: 'Candidate experience' },
              { value: '2x', label: 'Faster hiring cycle' },
              { value: '11k', label: 'Jobs started' },
            ].map((item) => (
              <div key={item.label} className="text-center">
                <div className="text-4xl font-black text-white">{item.value}</div>
                <div className="mt-2 text-sm text-slate-300">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 md:px-6">
        <div className="rounded-3xl bg-blue-600 px-6 py-10 text-center text-white md:px-12">
          <h2 className="text-3xl font-bold">Ready to move from skills to work?</h2>
          <p className="mx-auto mt-3 max-w-2xl text-blue-100">
            Join a professional ecosystem designed to help learners, employers, and training providers grow with clarity.
          </p>
          <div className="mt-6 flex justify-center gap-4">
            <Link to="/register"><Button className="bg-white text-blue-700 hover:bg-slate-100">Create account</Button></Link>
            <Link to="/contact"><Button variant="secondary" className="border border-white/20 bg-white/10 text-white hover:bg-white/20">Talk to us</Button></Link>
          </div>
        </div>
      </section>
    </div>
  )
}
