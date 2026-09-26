import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-950 text-slate-300">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:grid-cols-4 md:px-6">
        <div>
          <div className="mb-4 flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 font-bold text-white">SB</div>
            <div className="font-semibold text-white">Skill Bridge</div>
          </div>
          <p className="text-sm text-slate-400">
            Build skills. Prove skills. Find opportunities.
          </p>
        </div>

        <div>
          <h3 className="mb-3 font-semibold text-white">Platform</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/about">About</Link></li>
            <li><Link to="/how-it-works">How it works</Link></li>
            <li><Link to="/jobs">Find jobs</Link></li>
            <li><Link to="/companies">Companies</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="mb-3 font-semibold text-white">Resources</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/training">Training</Link></li>
            <li><Link to="/skills">Skills</Link></li>
            <li><Link to="/career-resources">Career resources</Link></li>
            <li><Link to="/faq">FAQ</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="mb-3 font-semibold text-white">Legal</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/privacy-policy">Privacy policy</Link></li>
            <li><Link to="/terms">Terms</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-800 py-4 text-center text-sm text-slate-400">
        © 2026 Skill Bridge. Built for skill-to-employment success.
      </div>
    </footer>
  )
}
