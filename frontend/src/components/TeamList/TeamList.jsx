import { useStore } from '../../store/useStore'
import { getTeamStats } from '../../utils/stats'
import { Users, Plus, ChevronRight } from 'lucide-react'
import { clsx } from 'clsx'

export default function TeamList() {
  const { teams, selectedTeamId, setSelectedTeam } = useStore()

  return (
    <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 shadow-xl h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Users className="text-indigo-400 w-6 h-6" />
          <h2 className="text-xl font-bold text-white">Équipes</h2>
        </div>
      </div>

      <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar">
        {teams.map((team) => {
          const stats = getTeamStats(team)
          const isSelected = selectedTeamId === team.id

          return (
            <button
              key={team.id}
              onClick={() => setSelectedTeam(team.id)}
              className={clsx(
                "w-full text-left p-4 rounded-xl border transition-all duration-200 group relative overflow-hidden",
                isSelected 
                  ? "bg-indigo-500/10 border-indigo-500/50 shadow-[0_0_20px_rgba(99,102,241,0.1)]" 
                  : "bg-slate-800/40 border-slate-700/50 hover:border-slate-600 hover:bg-slate-800/60"
              )}
            >
              <div className="flex items-center justify-between relative z-10">
                <div>
                  <h3 className={clsx(
                    "font-bold transition-colors",
                    isSelected ? "text-indigo-400" : "text-slate-200 group-hover:text-white"
                  )}>
                    {team.name}
                  </h3>
                  <div className="flex items-center gap-3 mt-1 text-xs text-slate-400 font-medium">
                    <span>{stats.totalPoints} pts</span>
                    <span className="w-1 h-1 rounded-full bg-slate-700" />
                    <span>{team.team_defi_results?.length || 0} défis</span>
                  </div>
                </div>
                <ChevronRight className={clsx(
                  "w-5 h-5 transition-transform duration-300",
                  isSelected ? "text-indigo-500 translate-x-1" : "text-slate-600 group-hover:text-slate-400"
                )} />
              </div>
              
              {isSelected && (
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-transparent pointer-events-none" />
              )}
            </button>
          )
        })}
        
        {teams.length === 0 && (
          <div className="text-center py-10 text-slate-500 italic border-2 border-dashed border-slate-800 rounded-xl">
            Aucune équipe
          </div>
        )}
      </div>
    </div>
  )
}
