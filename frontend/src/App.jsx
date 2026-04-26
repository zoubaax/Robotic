import React, { useEffect, useState } from 'react'
import { useStore } from './store/useStore'
import { useReveal } from './hooks/useReveal'
import TeamList from './components/TeamList/TeamList'
import MapUI from './components/Map/MapUI'
import Leaderboard from './components/Leaderboard/Leaderboard'
import BonusForm from './components/Dashboard/BonusForm'
import DefiModal from './components/Modals/DefiModal'
import { Clock, Play, Square, Trophy, LayoutDashboard, Settings, User } from 'lucide-react'
import { formatDuration } from './utils/stats'
import { clsx } from 'clsx'

export default function App() {
  useReveal()
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
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-brand-blue/10">
      {/* Sidebar Navigation - Professional Style */}
      <nav className="fixed left-0 top-0 bottom-0 w-24 bg-brand-navy border-r border-white/10 flex flex-col items-center py-10 gap-10 z-40">
        <div className="reveal-element">
          <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-lg mb-2">
            <Trophy className="text-brand-navy w-6 h-6" />
          </div>
          <div className="text-[8px] text-white/40 font-bold uppercase tracking-[0.2em] text-center">UPF</div>
        </div>
        
        <div className="flex flex-col gap-6 reveal-element delay-100">
          <NavButton active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} icon={<LayoutDashboard />} label="Dashboard" />
          <NavButton active={activeTab === 'leaderboard'} onClick={() => setActiveTab('leaderboard')} icon={<Trophy />} label="Ranking" />
        </div>
        
        <div className="mt-auto reveal-element delay-200">
          <NavButton active={false} onClick={() => {}} icon={<Settings />} label="Config" />
        </div>
      </nav>

      <main className="pl-24 min-h-screen">
        {/* Header - Academic Style */}
        <header className="h-24 border-b border-slate-100 flex items-center justify-between px-10 bg-white/80 backdrop-blur-md sticky top-0 z-30">
          <div className="flex items-center gap-6 reveal-element">
            <div>
              <div className="text-[10px] uppercase font-bold tracking-[0.3em] text-brand-blue mb-0.5">Academic Engineering</div>
              <h1 className="text-2xl font-semibold text-brand-navy tracking-tight uppercase">
                Robotic <span className="font-light italic text-slate-400">Challenge</span>
              </h1>
            </div>
            
            <div className="h-10 w-[1px] bg-slate-200" />
            
            {selectedTeam ? (
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Active Unit</span>
                <div className="flex items-center gap-2 px-3 py-1 bg-brand-light rounded border border-slate-200">
                  <User className="w-3 h-3 text-brand-navy" />
                  <span className="text-xs font-bold text-brand-navy">{selectedTeam.name}</span>
                </div>
              </div>
            ) : (
              <div className="text-xs font-medium text-slate-400 italic">No team selected</div>
            )}
          </div>

          <div className="flex items-center gap-8 reveal-element">
            {selectedTeam && (
              <div className="flex items-center gap-6">
                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Operation Time</span>
                  <span className="font-mono text-xl font-medium text-brand-navy tabular-nums">
                    {formatDuration(selectedTeam.start_time, selectedTeam.end_time)}
                  </span>
                </div>
                
                <div className="flex gap-2">
                  {!selectedTeam.start_time ? (
                    <button 
                      onClick={handleStartTime}
                      className="flex items-center gap-2 bg-brand-navy text-white px-5 py-2.5 rounded text-xs font-bold transition-all hover:bg-slate-800 active:scale-95 shadow-md shadow-brand-navy/10"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" /> Initialize
                    </button>
                  ) : !selectedTeam.end_time ? (
                    <button 
                      onClick={handleEndTime}
                      className="flex items-center gap-2 bg-rose-600 text-white px-5 py-2.5 rounded text-xs font-bold transition-all hover:bg-rose-700 active:scale-95 shadow-md shadow-rose-600/10"
                    >
                      <Square className="w-3.5 h-3.5 fill-current" /> Terminate
                    </button>
                  ) : (
                    <button 
                      onClick={() => updateTeamTime(selectedTeamId, 'end_time', null)}
                      className="text-[10px] font-bold text-brand-blue uppercase tracking-widest hover:underline px-4"
                    >
                      Reset Clock
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Content Area */}
        <div className="p-10 max-w-7xl mx-auto">
          {activeTab === 'dashboard' ? (
            <div className="grid grid-cols-12 gap-10">
              {/* Left Column: Teams */}
              <div className="col-span-12 lg:col-span-3 reveal-element">
                <div className="mb-6">
                  <span className="text-[11px] uppercase tracking-[0.2em] font-bold text-brand-blue border-b-2 border-brand-blue pb-1">
                    Participants
                  </span>
                </div>
                <div className="h-[calc(100vh-240px)]">
                  <TeamList />
                </div>
              </div>

              {/* Middle Column: Map & Bonus */}
              <div className="col-span-12 lg:col-span-9 flex flex-col gap-10">
                <div className="reveal-element delay-100">
                  <div className="mb-6">
                    <span className="text-[11px] uppercase tracking-[0.2em] font-bold text-brand-blue border-b-2 border-brand-blue pb-1">
                      Challenge Environment
                    </span>
                  </div>
                  <div className="h-[500px]">
                    <MapUI onSelectDefi={setSelectedDefi} />
                  </div>
                </div>
                
                <div className="reveal-element delay-200">
                  <BonusForm />
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto reveal-element">
              <div className="mb-12 text-center">
                <span className="text-[12px] uppercase tracking-[0.4em] font-bold text-brand-blue mb-4 block">Official Records</span>
                <h2 className="text-4xl font-semibold text-brand-navy">Competition Leaderboard</h2>
                <div className="w-20 h-1 bg-brand-blue mx-auto mt-6" />
              </div>
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

function NavButton({ icon, active, onClick, label }) {
  return (
    <button 
      onClick={onClick}
      className={clsx(
        "flex flex-col items-center gap-2 transition-all duration-300 relative group",
        active ? "text-white" : "text-white/40 hover:text-white"
      )}
    >
      <div className={clsx(
        "p-3 rounded-lg transition-all",
        active ? "bg-white/10 shadow-inner" : "group-hover:bg-white/5"
      )}>
        {React.cloneElement(icon, { className: "w-5 h-5" })}
      </div>
      <span className="text-[9px] font-bold uppercase tracking-wider">{label}</span>
      {active && (
        <div className="absolute -right-6 top-1/2 -translate-y-1/2 w-1 h-6 bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
      )}
    </button>
  )
}
