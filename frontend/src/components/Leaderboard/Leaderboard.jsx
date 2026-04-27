import { useStore } from '../../store/useStore'
import { getTeamStats, formatDuration } from '../../utils/stats'
import { Clock, Medal, Users, Layout, Target, Trophy } from 'lucide-react'
import { clsx } from 'clsx'
import LiveTimer from '../UI/LiveTimer'

export default function Leaderboard() {
  const teams = useStore((state) => state.teams)

  const rankedTeams = [...teams]
    .map((team) => ({
      ...team,
      stats: getTeamStats(team),
      bonus: team.team_bonus?.[0] || { presentation_points: 0, design_points: 0, mission_points: 0 },
    }))
    .sort((a, b) => {
      if (b.stats.totalPoints !== a.stats.totalPoints) {
        return b.stats.totalPoints - a.stats.totalPoints
      }
      return a.stats.totalTimeMs - b.stats.totalTimeMs
    })

  return (
    <div className="bg-white border border-slate-100 rounded-lg shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-brand-light border-b border-slate-100 text-slate-500 text-[10px] uppercase font-bold tracking-[0.15em]">
              <th className="py-4 px-6">#</th>
              <th className="py-4 px-6">Équipe</th>
              <th className="py-4 px-6 text-center">Défis</th>
              <th className="py-4 px-6 text-center">Présentation</th>
              <th className="py-4 px-6 text-center">Design</th>
              <th className="py-4 px-6 text-center">Mission</th>
              <th className="py-4 px-6 text-center">Total</th>
              <th className="py-4 px-6 text-right">Temps</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {rankedTeams.map((team, index) => (
              <tr key={team.id} className="group hover:bg-brand-light/30 transition-colors">
                <td className="py-5 px-6">
                  <div className={clsx(
                    "w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs",
                    index === 0 ? "bg-yellow-400 text-yellow-900 shadow-sm" :
                    index === 1 ? "bg-slate-200 text-slate-700" :
                    index === 2 ? "bg-amber-100 text-amber-800" :
                    "bg-slate-50 text-slate-400"
                  )}>
                    {index + 1}
                  </div>
                </td>
                <td className="py-5 px-6">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-brand-navy text-sm">{team.name}</span>
                    {index === 0 && <Medal className="w-4 h-4 text-yellow-500 animate-bounce" />}
                  </div>
                </td>
                <td className="py-5 px-6 text-center">
                  <span className="text-sm font-bold text-slate-600">{team.stats.defiPoints}</span>
                </td>
                <td className="py-5 px-6 text-center">
                  <span className={clsx(
                    "text-sm font-bold",
                    team.bonus.presentation_points > 0 ? "text-brand-blue" : "text-slate-300"
                  )}>
                    {team.bonus.presentation_points}<span className="text-[9px] text-slate-400">/10</span>
                  </span>
                </td>
                <td className="py-5 px-6 text-center">
                  <span className={clsx(
                    "text-sm font-bold",
                    team.bonus.design_points > 0 ? "text-brand-blue" : "text-slate-300"
                  )}>
                    {team.bonus.design_points}<span className="text-[9px] text-slate-400">/15</span>
                  </span>
                </td>
                <td className="py-5 px-6 text-center">
                  <span className={clsx(
                    "text-sm font-bold",
                    team.bonus.mission_points > 0 ? "text-brand-blue" : "text-slate-300"
                  )}>
                    {team.bonus.mission_points}<span className="text-[9px] text-slate-400">/10</span>
                  </span>
                </td>
                <td className="py-5 px-6 text-center">
                  <div className="flex flex-col items-center">
                    <div className="px-3 py-1 bg-brand-blue/5 rounded text-brand-blue font-bold text-sm">
                      {team.stats.totalPoints}<span className="text-[10px] text-slate-400">/{team.stats.maxPoints}</span>
                    </div>
                    <span className="text-[9px] font-bold text-slate-400 mt-0.5">{team.stats.percentage}%</span>
                  </div>
                </td>
                <td className="py-5 px-6 text-right">
                  <div className={clsx(
                    "flex items-center justify-end gap-1.5 font-mono text-sm",
                    team.start_time && !team.end_time ? "text-emerald-600" : "text-slate-400"
                  )}>
                    <Clock className="w-3.5 h-3.5" />
                    <LiveTimer startTime={team.start_time} endTime={team.end_time} />
                    {team.start_time && !team.end_time && (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {rankedTeams.length === 0 && (
              <tr>
                <td colSpan={8} className="py-20 text-center text-slate-400 italic text-sm">
                  Le classement est vide.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
