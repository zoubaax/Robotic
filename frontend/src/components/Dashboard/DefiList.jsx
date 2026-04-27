import { useStore } from '../../store/useStore'
import LiveTimer from '../UI/LiveTimer'
import { CheckCircle2, XCircle, Circle, Clock, ListChecks } from 'lucide-react'
import { clsx } from 'clsx'

export default function DefiList({ onSelectDefi }) {
  const { defis, selectedTeamId, teams } = useStore()
  const selectedTeam = teams.find(t => t.id === selectedTeamId)
  const results = selectedTeam?.team_defi_results || []

  if (!selectedTeamId) return null

  const getResult = (defiId) => results.find(r => r.defi_id === defiId)

  const completed = results.filter(r => r.status === 'PASS').length
  const failed = results.filter(r => r.status === 'FAIL').length
  const pending = defis.length - completed - failed

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <ListChecks className="w-5 h-5 text-brand-blue" />
          <div>
            <h3 className="text-sm font-bold text-brand-navy uppercase tracking-wider">
              Défis — {selectedTeam.name}
            </h3>
            <div className="flex items-center gap-1 mt-0.5 text-[10px] font-mono font-bold tabular-nums text-slate-400">
              <Clock className="w-3 h-3" />
              <LiveTimer startTime={selectedTeam.start_time} endTime={selectedTeam.end_time} />
              {selectedTeam.start_time && !selectedTeam.end_time && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse ml-1" />
              )}
            </div>
          </div>
        </div>

        {/* Progress summary */}
        <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-wider">
          <span className="text-emerald-600">{completed} ✓</span>
          <span className="text-rose-500">{failed} ✗</span>
          <span className="text-slate-400">{pending} …</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="flex h-1.5 rounded-full overflow-hidden bg-slate-100 mb-6">
        <div className="bg-emerald-500 transition-all duration-500" style={{ width: `${(completed / defis.length) * 100}%` }} />
        <div className="bg-rose-500 transition-all duration-500" style={{ width: `${(failed / defis.length) * 100}%` }} />
      </div>

      {/* Défis list */}
      <div className="space-y-2">
        {defis.map((defi) => {
          const result = getResult(defi.id)
          const status = result?.status
          const points = result?.points_earned || 0

          return (
            <button
              key={defi.id}
              onClick={() => onSelectDefi(defi)}
              className={clsx(
                "w-full flex items-center justify-between p-3 rounded-lg border transition-all group hover:shadow-sm",
                status === 'PASS'
                  ? "bg-emerald-50/50 border-emerald-200"
                  : status === 'FAIL'
                  ? "bg-rose-50/50 border-rose-200"
                  : "bg-slate-50/50 border-slate-100 hover:border-brand-blue/30 hover:bg-brand-light/50"
              )}
            >
              <div className="flex items-center gap-3">
                {/* Status icon */}
                <div className={clsx(
                  "w-7 h-7 rounded-full flex items-center justify-center",
                  status === 'PASS' ? "bg-emerald-500 text-white" :
                  status === 'FAIL' ? "bg-rose-500 text-white" :
                  "bg-slate-200 text-slate-400 group-hover:bg-brand-blue/10 group-hover:text-brand-blue"
                )}>
                  {status === 'PASS' ? <CheckCircle2 className="w-4 h-4" /> :
                   status === 'FAIL' ? <XCircle className="w-4 h-4" /> :
                   <Circle className="w-4 h-4" />}
                </div>

                {/* Name + type */}
                <div className="text-left">
                  <span className={clsx(
                    "text-sm font-semibold block",
                    status === 'PASS' ? "text-emerald-700" :
                    status === 'FAIL' ? "text-rose-700 line-through" :
                    "text-slate-700"
                  )}>
                    {defi.name}
                  </span>
                  <span className="text-[9px] text-slate-400 uppercase tracking-widest font-bold">
                    {defi.type === 'visitor-based' ? 'Dynamique' : 'Fixe'} • {defi.base_points} pts base
                  </span>
                </div>
              </div>

              {/* Points earned */}
              <div className="text-right">
                {status ? (
                  <div className={clsx(
                    "text-sm font-bold",
                    status === 'PASS' ? "text-emerald-600" : "text-rose-400"
                  )}>
                    {status === 'PASS' ? `+${points}` : '0'} pts
                  </div>
                ) : (
                  <span className="text-[10px] text-slate-300 font-bold uppercase tracking-wider group-hover:text-brand-blue transition-colors">
                    Évaluer →
                  </span>
                )}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
