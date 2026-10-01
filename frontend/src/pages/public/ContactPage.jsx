import Button from '../../components/common/Button'

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 md:px-6">
      <span className="section-kicker">Contact</span>
      <h1 className="section-title mt-4">Tell us how we can help.</h1>
      <div className="mt-10 grid gap-8 rounded-3xl border border-slate-200 bg-white p-6 md:grid-cols-2">
        <div>
          <div className="space-y-4">
            <div><label className="field-label">Name</label><input className="w-full rounded-xl border border-slate-200 px-3 py-2.5" placeholder="Your name" /></div>
            <div><label className="field-label">Email</label><input className="w-full rounded-xl border border-slate-200 px-3 py-2.5" placeholder="you@example.com" /></div>
            <div><label className="field-label">Message</label><textarea className="w-full rounded-xl border border-slate-200 px-3 py-2.5" rows="5" placeholder="How can we help?" /></div>
            <Button type="submit">Send message</Button>
          </div>
        </div>
        <div className="rounded-2xl bg-slate-50 p-6">
          <h3 className="text-xl font-bold text-slate-900">Support</h3>
          <p className="mt-3 text-slate-600">Reach our team for onboarding, employer partnerships, learner support, or platform questions.</p>
          <div className="mt-6 space-y-3 text-sm text-slate-700">
            <div>Email: hello@skillbridge.app</div>
            <div>Phone: +234 800 000 0000</div>
            <div>Hours: Monday to Friday, 8am – 6pm</div>
          </div>
        </div>
      </div>
    </div>
  )
}
