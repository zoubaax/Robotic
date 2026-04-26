import { useStore } from '../../store/useStore'
import { MapPin, CheckCircle2, XCircle, HelpCircle } from 'lucide-react'
import { clsx } from 'clsx'

// Mock coordinates for the "map"
const DEFI_POSITIONS = {
  'Rocane': { x: '15%', y: '20%' },
  'Rond-point': { x: '45%', y: '15%' },
  '4 Visiteur': { x: '75%', y: '25%' },
  'Feux Rouge': { x: '20%', y: '55%' },
  'Vitesse 80': { x: '50%', y: '45%' },
  'Sable': { x: '80%', y: '60%' },
  'Stop': { x: '45%', y: '80%' },
}

export default function MapUI({ onSelectDefi }) {
  const { defis, selectedTeamId, teams } = useStore()
  
  const selectedTeam = teams.find(t => t.id === selectedTeamId)
  const results = selectedTeam?.team_defi_results || []

  const getDefiStatus = (defiId) => {
    const result = results.find(r => r.defi_id === defiId)
    return result?.status || 'NOT_ATTEMPTED'
  }

  return (
    <div className="relative w-full aspect-[16/9] bg-slate-950 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl group">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-20" 
        style={{ 
          backgroundImage: 'radial-gradient(circle at 2px 2px, #334155 1px, transparent 0)',
          backgroundSize: '40px 40px' 
        }} 
      />
      
      <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-900 to-indigo-950/30" />
      
      {/* Visual paths (decorative) */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
        <path d="M 15% 20% L 45% 15% L 75% 25% L 80% 60% L 45% 80% L 20% 55% L 50% 45% Z" 
          fill="none" stroke="currentColor" strokeWidth="2" className="text-indigo-500" strokeDasharray="8 8" />
      </svg>

      {/* Defi Markers */}
      {defis.map((defi) => {
        const pos = DEFI_POSITIONS[defi.name] || { x: '50%', y: '50%' }
        const status = getDefiStatus(defi.id)
        
        return (
          <button
            key={defi.id}
            onClick={() => onSelectDefi(defi)}
            disabled={!selectedTeamId}
            style={{ left: pos.x, top: pos.y }}
            className={clsx(
              "absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2 group/marker transition-all duration-300",
              !selectedTeamId ? "opacity-50 cursor-not-allowed" : "hover:scale-110"
            )}
          >
            <div className={clsx(
              "p-2 rounded-xl border-2 shadow-lg transition-all",
              status === 'PASS' ? "bg-emerald-500/20 border-emerald-500 text-emerald-400" :
              status === 'FAIL' ? "bg-rose-500/20 border-rose-500 text-rose-400" :
              "bg-slate-800 border-slate-600 text-slate-400 group-hover/marker:border-indigo-400 group-hover/marker:text-indigo-300"
            )}>
              {status === 'PASS' ? <CheckCircle2 className="w-6 h-6" /> :
               status === 'FAIL' ? <XCircle className="w-6 h-6" /> :
               <MapPin className="w-6 h-6" />}
            </div>
            
            <div className="bg-slate-900/90 backdrop-blur px-2 py-1 rounded-md border border-slate-700 text-[10px] font-bold text-white uppercase tracking-wider shadow-xl opacity-0 group-hover/marker:opacity-100 transition-opacity whitespace-nowrap">
              {defi.name} ({defi.base_points} pts)
            </div>
          </button>
        )
      })}

      {!selectedTeamId && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-950/40 backdrop-blur-[2px] z-10">
          <div className="bg-slate-900/90 border border-slate-700 p-6 rounded-2xl flex flex-col items-center gap-4 text-center shadow-2xl">
            <HelpCircle className="w-12 h-12 text-indigo-400 animate-pulse" />
            <p className="text-slate-300 font-medium">Sélectionnez une équipe pour commencer</p>
          </div>
        </div>
      )}
      
      <div className="absolute bottom-4 left-6 flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">
        <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500" /> Réussi</div>
        <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-rose-500" /> Échoué</div>
        <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-slate-600" /> À faire</div>
      </div>
    </div>
  )
}
