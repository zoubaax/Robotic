import { useStore } from '../../store/useStore'
import { getTeamStats } from '../../utils/stats'
import { ChevronRight, User } from 'lucide-react'
import { clsx } from 'clsx'

export default function TeamList() {
  const { teams, selectedTeamId, setSelectedTeam } = useStore()

  return (
    <div className="h-full flex flex-col">
      <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar">
        {teams.map((team, i) => {
          const stats = getTeamStats(team)
          const isSelected = selectedTeamId === team.id

          return (
            <button
              key={team.id}
              onClick={() => setSelectedTeam(team.id)}
              className={clsx(
                "w-full text-left p-5 rounded border transition-all duration-300 group relative",
                isSelected 
                  ? "bg-brand-light border-brand-blue shadow-sm" 
                  : "bg-white border-slate-100 hover:border-slate-200 hover:bg-brand-light/50 shadow-sm shadow-slate-200/20"
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={clsx(
                    "w-10 h-10 rounded-full flex items-center justify-center transition-colors",
                    isSelected ? "bg-brand-blue text-white" : "bg-slate-100 text-slate-400 group-hover:bg-slate-200"
                  )}>
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className={clsx(
                      "font-semibold text-sm transition-colors",
                      isSelected ? "text-brand-navy" : "text-slate-600 group-hover:text-brand-navy"
                    )}>
                      {team.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] font-bold text-brand-blue uppercase tracking-wider">
                        {stats.totalPoints} Points
                      </span>
                      <span className="w-1 h-1 rounded-full bg-slate-300" />
                      <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider italic">
                        {team.team_defi_results?.length || 0} Complete
                      </span>
                    </div>
                  </div>
                </div>
                <ChevronRight className={clsx(
                  "w-4 h-4 transition-all duration-300",
                  isSelected ? "text-brand-blue translate-x-1" : "text-slate-300 group-hover:text-slate-400"
                )} />
              </div>
              
              {isSelected && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-2/3 bg-brand-blue rounded-r" />
              )}
            </button>
          )
        })}
        
        {teams.length === 0 && (
          <div className="text-center py-12 bg-brand-light/50 border border-slate-100 rounded italic text-slate-400 text-sm">
            No teams registered in the database.
          </div>
        )}
      </div>
    </div>
  )
}
