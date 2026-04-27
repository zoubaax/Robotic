import React, { useEffect, useState } from 'react'
import { useStore } from '../store/useStore'
import { useReveal } from '../hooks/useReveal'
import TeamList from '../components/TeamList/TeamList'
import MapUI from '../components/Map/MapUI'
import Leaderboard from '../components/Leaderboard/Leaderboard'
import BonusForm from '../components/Dashboard/BonusForm'
import DefiModal from '../components/Modals/DefiModal'
import LiveTimer from '../components/UI/LiveTimer'
import { Clock, Trophy, LayoutDashboard, Settings, User, LogOut } from 'lucide-react'
import { clsx } from 'clsx'
import { useNavigate } from 'react-router-dom'
import upfLogo from '../assets/upf-logo.png'
import clubLogo from '../assets/UPF LOGO CLUBS-robotique-09.png'

export default function Dashboard() {
  useReveal()
  const navigate = useNavigate()
  const { 
    teams, 
    selectedTeamId, 
    fetchTeams, 
    fetchDefis, 
    subscribeToChanges,
    startTeam,
    pauseTeam,
    resumeTeam,
    stopTeam,
    restartTeam,
    askConfirmation,
    user,
    logout
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

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-brand-blue/10">
      {/* Sidebar Navigation */}
      <nav className="fixed left-0 top-0 bottom-0 w-24 bg-brand-navy border-r border-white/10 flex flex-col items-center py-10 gap-10 z-40">
        <div className="reveal-element">
          <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center shadow-lg mb-2 overflow-hidden p-1">
            <img src={clubLogo} alt="Club Logo" className="w-full h-full object-contain" />
          </div>
          <div className="text-[8px] text-white/40 font-bold uppercase tracking-[0.2em] text-center">Robotique</div>
        </div>
        
        <div className="flex flex-col gap-6 reveal-element delay-100">
          <NavButton active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} icon={<LayoutDashboard />} label="Dashboard" />
          <NavButton active={activeTab === 'leaderboard'} onClick={() => setActiveTab('leaderboard')} icon={<Trophy />} label="Ranking" />
        </div>
        
        <div className="mt-auto reveal-element delay-200 flex flex-col gap-6">
          <NavButton active={false} onClick={() => {}} icon={<Settings />} label="Config" />
          <NavButton active={false} onClick={handleLogout} icon={<LogOut className="text-rose-400" />} label="Logout" />
        </div>
      </nav>

      <main className="pl-24 min-h-screen">
        {/* Header */}
        <header className="h-24 border-b border-slate-100 flex items-center justify-between px-10 bg-white/80 backdrop-blur-md sticky top-0 z-30">
          <div className="flex items-center gap-6 reveal-element">
            <img src={upfLogo} alt="UPF Logo" className="h-12 w-auto" />
            
            <div className="h-10 w-[1px] bg-slate-200" />
            
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
                  <span className={clsx(
                    "font-mono text-xl font-medium tabular-nums",
                    selectedTeam.start_time && !selectedTeam.end_time && !selectedTeam.paused_at ? "text-emerald-600 animate-pulse" : 
                    selectedTeam.paused_at ? "text-amber-500" : "text-brand-navy"
                  )}>
                    <LiveTimer 
                      startTime={selectedTeam.start_time} 
                      endTime={selectedTeam.end_time}
                      pausedAt={selectedTeam.paused_at}
                      totalPausedMs={selectedTeam.total_paused_ms}
                    />
                  </span>
                </div>
              </div>
            )}
            
            <div className="flex items-center gap-2">
              {!selectedTeam?.start_time && (
                <button 
                  onClick={() => startTeam(selectedTeamId)}
                  disabled={!selectedTeam}
                  className="bg-brand-blue text-white px-5 py-2.5 rounded shadow-lg shadow-brand-blue/20 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest hover:bg-brand-blue/90 disabled:opacity-30 disabled:shadow-none transition-all"
                >
                  Start
                </button>
              )}

              {selectedTeam?.start_time && !selectedTeam?.end_time && (
                <>
                  {selectedTeam.paused_at ? (
                    <button 
                      onClick={() => resumeTeam(selectedTeamId)}
                      className="bg-emerald-500 text-white px-5 py-2.5 rounded shadow-lg shadow-emerald-500/20 text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-600 transition-all"
                    >
                      Resume
                    </button>
                  ) : (
                    <button 
                      onClick={() => pauseTeam(selectedTeamId)}
                      className="bg-amber-500 text-white px-5 py-2.5 rounded shadow-lg shadow-amber-500/20 text-[10px] font-bold uppercase tracking-widest hover:bg-amber-600 transition-all"
                    >
                      Pause
                    </button>
                  )}
                  <button 
                    onClick={() => stopTeam(selectedTeamId)}
                    className="bg-brand-navy text-white px-5 py-2.5 rounded shadow-lg shadow-brand-navy/20 text-[10px] font-bold uppercase tracking-widest hover:bg-slate-800 transition-all"
                  >
                    Stop
                  </button>
                </>
              )}

              {selectedTeam?.start_time && (
                <button 
                  onClick={() => {
                    askConfirmation({
                      title: 'Redémarrer le round ?',
                      message: 'Voulez-vous vraiment redémarrer ? Cela effacera définitivement les scores de cette équipe pour ce tour.',
                      onConfirm: () => restartTeam(selectedTeamId)
                    })
                  }}
                  className="bg-white text-slate-400 border border-slate-200 px-4 py-2.5 rounded text-[10px] font-bold uppercase tracking-widest hover:bg-slate-50 transition-all"
                >
                  Restart
                </button>
              )}
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-10 max-w-7xl mx-auto">
          {activeTab === 'dashboard' ? (
            <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-10">
              <div className="space-y-6 reveal-element delay-100">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">Participants</h2>
                  <button className="text-[10px] font-bold text-brand-blue uppercase hover:underline">Register New Unit</button>
                </div>
                <TeamList />
              </div>

              <div className="space-y-10 reveal-element delay-200">
                <div className="bg-white border border-slate-100 rounded-xl p-8 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">Challenge Environment</h2>
                  </div>
                  <MapUI onSelectDefi={setSelectedDefi} />
                </div>
                
                <BonusForm />
              </div>
            </div>
          ) : (
            <div className="reveal-element">
              <div className="mb-10">
                <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-brand-blue mb-2 block">Live Standings</span>
                <h2 className="text-3xl font-semibold text-brand-navy italic underline decoration-slate-200 underline-offset-8">Championship Leaderboard</h2>
              </div>
              <Leaderboard />
            </div>
          )}
        </div>
      </main>

      {/* Evaluation Modal */}
      {selectedDefi && selectedTeamId && (
        <DefiModal 
          defi={selectedDefi} 
          teamId={selectedTeamId} 
          onClose={() => setSelectedDefi(null)} 
        />
      )}
    </div>
  )
}

function NavButton({ active, icon, label, onClick }) {
  return (
    <button 
      onClick={onClick}
      className={clsx(
        "flex flex-col items-center gap-2 transition-all group",
        active ? "text-white" : "text-white/40 hover:text-white/70"
      )}
    >
      <div className={clsx(
        "w-10 h-10 rounded-xl flex items-center justify-center transition-all",
        active ? "bg-brand-blue shadow-lg shadow-brand-blue/40" : "bg-white/5 group-hover:bg-white/10"
      )}>
        {React.cloneElement(icon, { size: 18 })}
      </div>
      <span className="text-[9px] font-bold uppercase tracking-wider">{label}</span>
    </button>
  )
}
