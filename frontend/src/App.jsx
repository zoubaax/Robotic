import React, { useEffect, useState } from 'react'
import { useStore } from './store/useStore'
import TeamList from './components/TeamList/TeamList'
import MapUI from './components/Map/MapUI'
import Leaderboard from './components/Leaderboard/Leaderboard'
import BonusForm from './components/Dashboard/BonusForm'
import DefiModal from './components/Modals/DefiModal'
import { Clock, Play, Square, Trophy, LayoutDashboard, Settings } from 'lucide-react'
import { formatDuration } from './utils/stats'
import { clsx } from 'clsx'

export default function App() {
  const { 
    teams, 
    selectedTeamId, 
    fetchTeams, 
    fetchDefis, 
    subscribeToChanges,
    updateTeamTime 
  } = useStore()
  
  const [selectedDefi, setSelectedDefi] = useState(null)
  const [activeTab, setActiveTab] = useState('dashboard')

  useEffect(() => {
    fetchTeams()
    fetchDefis()
    const unsubscribe = subscribeToChanges()
    return () => unsubscribe()
  }, [])

  const selectedTeam = teams.find(t => t.id === selectedTeamId)

  const handleStartTime = () => {
    if (!selectedTeam) return
    updateTeamTime(selectedTeamId, 'start_time', new Date().toISOString())
  }

  const handleEndTime = () => {
    if (!selectedTeam) return
    updateTeamTime(selectedTeamId, 'end_time', new Date().toISOString())
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans selection:bg-indigo-500/30">
      {/* Navigation */}
      <nav className="fixed left-0 top-0 bottom-0 w-20 bg-slate-900/50 backdrop-blur-xl border-r border-slate-800 flex flex-col items-center py-8 gap-8 z-40">
        <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20 mb-4">
          <Trophy className="text-white w-6 h-6" />
        </div>
        
        <NavButton active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} icon={<LayoutDashboard />} />
        <NavButton active={activeTab === 'leaderboard'} onClick={() => setActiveTab('leaderboard')} icon={<Trophy />} />
        
        <div className="mt-auto">
          <NavButton active={false} onClick={() => {}} icon={<Settings />} />
        </div>
      </nav>

      <main className="pl-20 min-h-screen">
        <header className="h-20 border-b border-slate-800 flex items-center justify-between px-8 bg-slate-950/50 backdrop-blur-md sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-black text-white tracking-tight uppercase italic">Robotic <span className="text-indigo-500">Challenge</span></h1>
            <div className="h-6 w-[1px] bg-slate-800" />
            {selectedTeam && (
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Équipe Actuelle:</span>
                <span className="text-sm font-bold text-indigo-400 px-3 py-1 bg-indigo-500/10 rounded-full border border-indigo-500/20">
                  {selectedTeam.name}
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-6">
            {selectedTeam && (
              <div className="flex items-center gap-4 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
                <div className="px-4 flex flex-col">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Chrono</span>
                  <span className="font-mono text-indigo-400 font-bold tabular-nums">
                    {formatDuration(selectedTeam.start_time, selectedTeam.end_time)}
                  </span>
                </div>
                {!selectedTeam.start_time ? (
                  <button 
                    onClick={handleStartTime}
                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all shadow-lg shadow-emerald-500/10"
                  >
                    <Play className="w-4 h-4 fill-current" /> Start
                  </button>
                ) : !selectedTeam.end_time ? (
                  <button 
                    onClick={handleEndTime}
                    className="flex items-center gap-2 bg-rose-600 hover:bg-rose-500 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all shadow-lg shadow-rose-500/10"
                  >
                    <Square className="w-4 h-4 fill-current" /> Stop
                  </button>
                ) : (
                  <button 
                    onClick={() => updateTeamTime(selectedTeamId, 'end_time', null)}
                    className="text-xs text-slate-500 hover:text-slate-400 px-3 transition-colors"
                  >
                    Reset
                  </button>
                )}
              </div>
            )}
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto">
          {activeTab === 'dashboard' ? (
            <div className="grid grid-cols-12 gap-8">
              {/* Left Column: Teams */}
              <div className="col-span-12 lg:col-span-3 h-[calc(100vh-160px)]">
                <TeamList />
              </div>

              {/* Middle Column: Map & Bonus */}
              <div className="col-span-12 lg:col-span-9 flex flex-col gap-8">
                <div className="flex-1">
                  <MapUI onSelectDefi={setSelectedDefi} />
                </div>
                <BonusForm />
              </div>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto">
              <Leaderboard />
            </div>
          )}
        </div>
      </main>

      {selectedDefi && (
        <DefiModal 
          defi={selectedDefi} 
          onClose={() => setSelectedDefi(null)} 
        />
      )}
    </div>
  )
}

function NavButton({ icon, active, onClick }) {
  return (
    <button 
      onClick={onClick}
      className={clsx(
        "p-3 rounded-xl transition-all duration-300 relative group",
        active ? "bg-indigo-600/10 text-indigo-500" : "text-slate-500 hover:text-slate-300 hover:bg-slate-800"
      )}
    >
      {React.cloneElement(icon, { className: "w-6 h-6" })}
      {active && (
        <div className="absolute left-[calc(100%+12px)] top-1/2 -translate-y-1/2 w-1 h-8 bg-indigo-500 rounded-full" />
      )}
    </button>
  )
}
