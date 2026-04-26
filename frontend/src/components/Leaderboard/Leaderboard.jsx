import { useStore } from '../../store/useStore'
import { getTeamStats, formatDuration } from '../../utils/stats'
import { Trophy, Clock, Star, Medal } from 'lucide-react'
import { clsx } from 'clsx'

export default function Leaderboard() {
  const teams = useStore((state) => state.teams)

  const rankedTeams = [...teams]
    .map((team) => ({
      ...team,
      stats: getTeamStats(team),
    }))
    .sort((a, b) => {
      if (b.stats.totalPoints !== a.stats.totalPoints) {
        return b.stats.totalPoints - a.stats.totalPoints
      }
      return a.stats.totalTimeMs - b.stats.totalTimeMs
    })

  return (
    <div className="bg-white border border-slate-100 rounded shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-brand-light border-b border-slate-100 text-slate-500 text-[11px] uppercase font-bold tracking-[0.2em]">
              <th className="py-5 px-8">Rank</th>
              <th className="py-5 px-8">Participating Team</th>
              <th className="py-5 px-8 text-center">Score</th>
              <th className="py-5 px-8 text-right">Time Log</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {rankedTeams.map((team, index) => (
              <tr key={team.id} className="group hover:bg-brand-light/30 transition-colors">
                <td className="py-6 px-8">
                  <div className={clsx(
                    "w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs",
                    index === 0 ? "bg-yellow-400 text-yellow-900 shadow-sm" :
                    index === 1 ? "bg-slate-200 text-slate-700" :
                    index === 2 ? "bg-amber-100 text-amber-800" :
                    "bg-slate-50 text-slate-400"
                  )}>
                    {index + 1}
                  </div>
                </td>
                <td className="py-6 px-8">
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-brand-navy">{team.name}</span>
                    {index === 0 && <Medal className="w-4 h-4 text-yellow-500 animate-bounce" />}
                  </div>
                </td>
                <td className="py-6 px-8">
                  <div className="flex items-center justify-center gap-2">
                    <div className="px-3 py-1 bg-brand-blue/5 rounded text-brand-blue font-bold text-sm">
                      {team.stats.totalPoints} <span className="text-[10px] uppercase ml-0.5">pts</span>
                    </div>
                  </div>
                </td>
                <td className="py-6 px-8 text-right">
                  <div className="flex items-center justify-end gap-2 text-slate-400 font-mono text-sm">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{formatDuration(team.start_time, team.end_time)}</span>
                  </div>
                </td>
              </tr>
            ))}
            {rankedTeams.length === 0 && (
              <tr>
                <td colSpan={4} className="py-20 text-center text-slate-400 italic text-sm">
                  The leaderboard is currently empty.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
