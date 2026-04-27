import { useEffect, useState } from 'react'
import { useStore } from '../store/useStore'
import { CheckCircle2, XCircle, MapPin, Trophy, Clock, Users, Zap } from 'lucide-react'
import { clsx } from 'clsx'
import { Link } from 'react-router-dom'
import LiveTimer from '../components/UI/LiveTimer'
import mapImage from '../assets/map.jpeg'

const DEFAULT_POSITIONS = {
  'Stop':        { x: 89, y: 29 },
  'Rond-point':  { x: 69, y: 43 },
  'Feux Rouge':  { x: 59, y: 34 },
  'Vitesse 80':  { x: 46, y: 44 },
  'Visiteur 1':  { x: 40, y: 28 },
  'Visiteur 2':  { x: 35, y: 50 },
  'Visiteur 3':  { x: 22, y: 45 },
  'Visiteur 4':  { x: 15, y: 35 },
  "Dos d'âne":   { x: 28, y: 32 },
  'Sable':       { x: 7,  y: 58 },
}

export default function LivePage() {
  const { teams, defis, fetchTeams, fetchDefis, fetchLiveState, subscribeToChanges, liveTeamId, visitorCount, markerPositions } = useStore()
  
  // Merge default positions with synced ones from DB
  const positions = { ...DEFAULT_POSITIONS, ...markerPositions }

  useEffect(() => {
    fetchTeams()
    fetchDefis()
    fetchLiveState()
    const unsubscribe = subscribeToChanges()
    return () => unsubscribe()
  }, [])

  // Show the team the admin has selected
  const displayTeam = teams.find(t => t.id === liveTeamId)
  const isRunning = displayTeam?.start_time && !displayTeam?.end_time && !displayTeam?.paused_at
  const isPaused = displayTeam?.paused_at

  const visibleDefis = defis.filter(d => {
    const match = d.name.match(/^Visiteur\s*(\d+)$/i)
    if (match) return parseInt(match[1]) <= visitorCount
    return true
  })

  const results = displayTeam?.team_defi_results || []
  const getDefiStatus = (defiId) => {
    const r = results.find(r => r.defi_id === defiId)
    return r?.status || null
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-brand-blue/10">
      {/* Header */}
      <header className="h-24 border-b border-slate-100 flex items-center justify-between px-10 bg-white/80 backdrop-blur-md sticky top-0 z-30">
        <div className="flex items-center gap-6">
          <div className="w-12 h-12 bg-brand-navy rounded-lg flex items-center justify-center shadow-lg">
            <Trophy className="text-white w-6 h-6" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold tracking-[0.3em] text-brand-blue mb-0.5">Academic Engineering</div>
            <h1 className="text-2xl font-semibold text-brand-navy tracking-tight uppercase">
              Robotic <span className="font-light italic text-slate-400">Challenge</span>
            </h1>
          </div>

          <div className="h-10 w-[1px] bg-slate-200" />

          {displayTeam ? (
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                {isRunning ? 'Équipe en Course' : isPaused ? 'En Pause' : 'Équipe Sélectionnée'}
              </span>
              <div className="flex items-center gap-2 px-3 py-1 bg-brand-light rounded border border-slate-200">
                <Users className="w-3 h-3 text-brand-navy" />
                <span className="text-xs font-bold text-brand-navy">{displayTeam.name}</span>
              </div>
            </div>
          ) : (
            <div className="text-xs font-medium text-slate-400 italic">En attente d'une équipe...</div>
          )}
        </div>

        <div className="flex items-center gap-8">
          {displayTeam && (
            <div className="flex items-center gap-4">
              {isRunning && (
                <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full">
                  <Zap className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">En Direct</span>
                </div>
              )}
              {isPaused && (
                <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-full">
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                  <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">En Pause</span>
                </div>
              )}
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Chronomètre</span>
                <span className={clsx(
                  "font-mono text-xl font-medium tabular-nums",
                  isRunning ? "text-emerald-600 animate-pulse" : 
                  isPaused ? "text-amber-500" : "text-brand-navy"
                )}>
                  <LiveTimer 
                    startTime={displayTeam.start_time} 
                    endTime={displayTeam.end_time}
                    pausedAt={displayTeam.paused_at}
                    totalPausedMs={displayTeam.total_paused_ms}
                  />
                </span>
              </div>
            </div>
          )}

          <Link
            to="/login"
            className="text-[10px] font-bold text-slate-300 hover:text-brand-blue uppercase tracking-widest transition-colors"
          >
            Admin
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="p-10 max-w-7xl mx-auto">
        {/* Progress */}
        {displayTeam && (
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-brand-blue to-emerald-500 rounded-full transition-all duration-700 ease-out"
                style={{ width: `${(results.length / Math.max(visibleDefis.length, 1)) * 100}%` }}
              />
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider tabular-nums">
              {results.length}/{visibleDefis.length} défis
            </span>
          </div>
        )}

        {/* Map */}
        <div className="bg-white border border-slate-100 rounded-xl p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">Parcours en Direct</h2>
            <div className="flex gap-4 bg-brand-light px-3 py-1.5 rounded-full border border-slate-100">
              <div className="flex items-center gap-1.5 text-[7px] font-bold uppercase tracking-widest text-slate-500">
                <div className="w-2 h-2 rounded-full bg-emerald-500" /> Réussi
              </div>
              <div className="flex items-center gap-1.5 text-[7px] font-bold uppercase tracking-widest text-slate-500">
                <div className="w-2 h-2 rounded-full bg-rose-500" /> Échoué
              </div>
              <div className="flex items-center gap-1.5 text-[7px] font-bold uppercase tracking-widest text-slate-500">
                <div className="w-2 h-2 rounded-full bg-red-500" /> En attente
              </div>
            </div>
          </div>

          <div className="relative rounded-lg overflow-hidden border border-slate-100">
            <img src={mapImage} alt="Parcours Robotique" className="w-full h-auto block select-none pointer-events-none" draggable={false} />

            {/* Markers */}
            {visibleDefis.map(defi => {
              const pos = positions[defi.name] || { x: 50, y: 50 }
              const status = getDefiStatus(defi.id)

              return (
                <div
                  key={defi.id}
                  style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-500"
                >
                  <div className={clsx(
                    "w-8 h-8 rounded-full flex items-center justify-center border-2 border-white shadow-lg transition-all duration-500",
                    status === 'PASS'
                      ? "bg-emerald-500 text-white ring-4 ring-emerald-300/40"
                      : status === 'FAIL'
                      ? "bg-rose-500 text-white ring-4 ring-rose-300/40"
                      : "bg-red-500 text-white ring-2 ring-red-300/40"
                  )}>
                    {status === 'PASS' && <CheckCircle2 className="w-4 h-4" />}
                    {status === 'FAIL' && <XCircle className="w-4 h-4" />}
                    {!status && <MapPin className="w-4 h-4" />}
                  </div>

                  <div className={clsx(
                    "absolute -bottom-7 left-1/2 -translate-x-1/2 text-[7px] font-bold px-2 py-0.5 rounded shadow-lg uppercase tracking-wider whitespace-nowrap pointer-events-none",
                    status === 'PASS'
                      ? "bg-emerald-600 text-white"
                      : status === 'FAIL'
                      ? "bg-rose-600 text-white"
                      : "bg-[#1e3a8a] text-white"
                  )}>
                    {defi.name}
                  </div>
                </div>
              )
            })}

            {/* No team overlay */}
            {!displayTeam && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-[2px] z-20">
                <div className="bg-white border border-slate-200 p-6 rounded-lg shadow-2xl flex flex-col items-center gap-3 text-center max-w-[280px]">
                  <div className="w-14 h-14 bg-brand-blue/10 rounded-full flex items-center justify-center">
                    <Clock className="w-7 h-7 text-brand-blue" />
                  </div>
                  <h4 className="text-sm font-bold text-brand-navy uppercase tracking-wider">Compétition</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    En attente du démarrage. Le parcours s'affichera en direct dès qu'une équipe commencera.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
