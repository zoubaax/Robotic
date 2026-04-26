import { useStore } from '../../store/useStore'
import { getTeamStats, formatDuration } from '../../utils/stats'
import { Trophy, Clock, Star } from 'lucide-react'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs) {
  return twMerge(clsx(inputs))
}

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
    <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 shadow-xl">
      <div className="flex items-center gap-3 mb-6">
        <Trophy className="text-yellow-500 w-6 h-6" />
        <h2 className="text-xl font-bold text-white">Classement Général</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 text-sm">
              <th className="pb-4 font-medium">Rang</th>
              <th className="pb-4 font-medium">Équipe</th>
              <th className="pb-4 font-medium">Points</th>
              <th className="pb-4 font-medium">Temps</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {rankedTeams.map((team, index) => (
              <tr key={team.id} className="group hover:bg-slate-800/30 transition-colors">
                <td className="py-4">
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center font-bold",
                    index === 0 ? "bg-yellow-500 text-yellow-950" :
                    index === 1 ? "bg-slate-300 text-slate-900" :
                    index === 2 ? "bg-amber-600 text-amber-950" :
                    "bg-slate-800 text-slate-400"
                  )}>
                    {index + 1}
                  </div>
                </td>
                <td className="py-4">
                  <span className="font-semibold text-slate-100">{team.name}</span>
                </td>
                <td className="py-4">
                  <div className="flex items-center gap-1.5">
                    <Star className="w-4 h-4 text-blue-400 fill-blue-400/20" />
                    <span className="font-bold text-blue-400">{team.stats.totalPoints}</span>
                  </div>
                </td>
                <td className="py-4">
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <Clock className="w-4 h-4" />
                    <span>{formatDuration(team.start_time, team.end_time)}</span>
                  </div>
                </td>
              </tr>
            ))}
            {rankedTeams.length === 0 && (
              <tr>
                <td colSpan={4} className="py-8 text-center text-slate-500 italic">
                  Aucune équipe enregistrée
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
