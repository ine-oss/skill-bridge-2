import TrainingCard from '../../components/cards/TrainingCard'
import { trainingCatalog } from '../../data/training'

export default function TrainingPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 md:px-6">
      <div className="mb-8">
        <span className="section-kicker">Training</span>
        <h1 className="section-title mt-4">Learn the skills employers need.</h1>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {trainingCatalog.map((training) => <TrainingCard key={training.id} training={training} />)}
      </div>
    </div>
  )
}
