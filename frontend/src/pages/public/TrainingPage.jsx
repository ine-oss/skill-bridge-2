import TrainingCard from '../../components/cards/TrainingCard'
import AsyncState from '../../components/common/AsyncState'
import useApi from '../../hooks/useApi'
import { toProgramView } from '../../lib/format'
import { trainingService } from '../../services/trainingService'

export default function TrainingPage() {
  const { data, loading, error, reload } = useApi(() => trainingService.getPrograms({ limit: 60 }), [])
  const programs = (data?.data || []).map(toProgramView)

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 md:px-6">
      <div className="mb-8">
        <span className="section-kicker">Training</span>
        <h1 className="section-title mt-4">Learn the skills employers need.</h1>
      </div>
      <AsyncState loading={loading} error={error} onRetry={reload} empty={programs.length === 0} emptyTitle="No programs published yet">
        <div className="grid gap-6 md:grid-cols-3">
          {programs.map((training) => <TrainingCard key={training.id} training={training} />)}
        </div>
      </AsyncState>
    </div>
  )
}
