import { useState } from 'react'
import { useStore } from '../../store/useStore'
import { getTeamStats } from '../../utils/stats'
import LiveTimer from '../UI/LiveTimer'
import { ChevronRight, User, Plus, X, Loader2, Clock } from 'lucide-react'
import { clsx } from 'clsx'

export default function TeamList() {
  const { teams, selectedTeamId, setSelectedTeam, addTeam } = useStore()
  const [isAdding, setIsAdding] = useState(false)
  const [newTeamName, setNewTeamName] = useState('')
  const [loading, setLoading] = useState(false)

  const handleAddTeam = async (e) => {
    e.preventDefault()
    if (!newTeamName.trim()) return
    
    setLoading(true)
    const team = await addTeam(newTeamName)
    if (team) {
      setNewTeamName('')
      setIsAdding(false)
      setSelectedTeam(team.id)
    }
    setLoading(false)
  }

  return (
    <div className="h-full flex flex-col gap-4">
      {/* Registration Button/Input */}
      <div className="flex flex-col">
        {!isAdding ? (
          <button 
            onClick={() => setIsAdding(true)}
            className="w-full py-4 border-2 border-dashed border-slate-200 rounded flex items-center justify-center gap-2 text-slate-400 hover:text-brand-blue hover:border-brand-blue hover:bg-brand-light/50 transition-all group"
          >
            <Plus className="w-4 h-4 transition-transform group-hover:rotate-90" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Register New Unit</span>
          </button>
        ) : (
          <form onSubmit={handleAddTeam} className="bg-white border border-brand-blue p-4 rounded shadow-lg shadow-brand-blue/5 animate-in slide-in-from-top-2 duration-200">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[9px] font-bold text-brand-blue uppercase tracking-[0.2em]">New Unit Identity</span>
              <button type="button" onClick={() => setIsAdding(false)} className="text-slate-400 hover:text-rose-500">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex gap-2">
              <input 
                autoFocus
                placeholder="Team Name..."
                value={newTeamName}
                onChange={(e) => setNewTeamName(e.target.value)}
                className="flex-1 bg-brand-light border border-slate-100 rounded px-3 py-2 text-xs font-semibold focus:outline-none focus:border-brand-blue"
              />
              <button 
                disabled={loading || !newTeamName.trim()}
                className="bg-brand-navy text-white px-3 py-2 rounded text-[10px] font-bold uppercase disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Register'}
              </button>
            </div>
          </form>
        )}
      </div>

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
                    <div className={clsx(
                      "flex items-center gap-1 mt-1 text-[10px] font-mono font-bold tabular-nums",
                      team.start_time && !team.end_time ? "text-emerald-600" : "text-slate-400"
                    )}>
                      <Clock className="w-3 h-3" />
                      <LiveTimer startTime={team.start_time} endTime={team.end_time} />
                      {team.start_time && !team.end_time && (
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse ml-1" />
                      )}
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

