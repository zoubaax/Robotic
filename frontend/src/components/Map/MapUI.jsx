import { useStore } from '../../store/useStore'
import { MapPin, CheckCircle2, XCircle, Info } from 'lucide-react'
import { clsx } from 'clsx'

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
    <div className="relative w-full h-full bg-slate-50 rounded border border-slate-200 overflow-hidden shadow-sm group">
      {/* Technical Grid Background */}
      <div className="absolute inset-0 opacity-[0.03]" 
        style={{ 
          backgroundImage: 'linear-gradient(#1e3a8a 1px, transparent 1px), linear-gradient(90deg, #1e3a8a 1px, transparent 1px)',
          backgroundSize: '20px 20px' 
        }} 
      />
      
      {/* Visual paths (decorative) - Technical Blueprint Style */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-10" viewBox="0 0 100 100" preserveAspectRatio="none">
        <path d="M 15 20 L 45 15 L 75 25 L 80 60 L 45 80 L 20 55 L 50 45 Z" 
          fill="none" stroke="#1e3a8a" strokeWidth="0.5" strokeDasharray="2 2" />
        <circle cx="15" cy="20" r="0.8" fill="#1e3a8a" />
        <circle cx="45" cy="15" r="0.8" fill="#1e3a8a" />
        <circle cx="75" cy="25" r="0.8" fill="#1e3a8a" />
      </svg>

      {/* Defi Markers - Technical Style */}
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
              "absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group/marker transition-all duration-300",
              !selectedTeamId ? "opacity-30 cursor-not-allowed" : "hover:scale-110 active:scale-95"
            )}
          >
            <div className={clsx(
              "w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all bg-white shadow-md",
              status === 'PASS' ? "border-emerald-500 text-emerald-500 bg-emerald-50" :
              status === 'FAIL' ? "border-rose-500 text-rose-500 bg-rose-50" :
              "border-slate-300 text-slate-400 group-hover/marker:border-brand-blue group-hover/marker:text-brand-blue"
            )}>
              {status === 'PASS' ? <CheckCircle2 className="w-5 h-5" /> :
               status === 'FAIL' ? <XCircle className="w-5 h-5" /> :
               <MapPin className="w-5 h-5" />}
            </div>
            
            <div className="mt-2 bg-brand-navy text-white text-[8px] font-bold px-2 py-0.5 rounded shadow-lg uppercase tracking-widest opacity-0 group-hover/marker:opacity-100 transition-opacity whitespace-nowrap z-20">
              {defi.name}
            </div>
          </button>
        )
      })}

      {!selectedTeamId && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-[1px] z-30">
          <div className="bg-white border border-slate-200 p-8 rounded shadow-2xl flex flex-col items-center gap-4 text-center max-w-xs">
            <div className="w-12 h-12 bg-brand-light rounded-full flex items-center justify-center">
              <Info className="w-6 h-6 text-brand-blue" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-brand-navy uppercase tracking-wider mb-2">Protocol Required</h4>
              <p className="text-xs text-slate-500 leading-relaxed">Please select a participating team from the registry to initialize the challenge map.</p>
            </div>
          </div>
        </div>
      )}
      
      <div className="absolute bottom-6 left-8 flex items-center gap-6 text-[9px] font-bold uppercase tracking-widest text-slate-400">
        <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500" /> Success</div>
        <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-rose-500" /> Failure</div>
        <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-slate-300" /> Pending</div>
      </div>
    </div>
  )
}
