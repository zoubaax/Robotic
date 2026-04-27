import { useState, useRef, useCallback } from 'react'
import { useStore } from '../../store/useStore'
import { CheckCircle2, XCircle, Info, Move, Save, X, MapPin, Users } from 'lucide-react'
import { clsx } from 'clsx'
import mapImage from '../../assets/map.jpeg'

// Default positions — will be overridden by saved calibration
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

function loadPositions() {
  try {
    const saved = localStorage.getItem('defi_positions')
    if (saved) return JSON.parse(saved)
  } catch {}
  return { ...DEFAULT_POSITIONS }
}

export default function MapUI({ onSelectDefi }) {
  const { defis, selectedTeamId, teams } = useStore()
  const selectedTeam = teams.find(t => t.id === selectedTeamId)
  const results = selectedTeam?.team_defi_results || []

  const [calibrating, setCalibrating] = useState(false)
  const [positions, setPositions] = useState(loadPositions)
  const [dragging, setDragging] = useState(null)
  const [visitorCount, setVisitorCount] = useState(() => {
    return parseInt(localStorage.getItem('visitor_count') || '0')
  })
  const containerRef = useRef(null)

  const handleVisitorCount = (n) => {
    setVisitorCount(n)
    localStorage.setItem('visitor_count', n.toString())
  }

  // Filter défis: hide Visiteur markers beyond the selected count
  const visibleDefis = defis.filter(d => {
    const match = d.name.match(/^Visiteur\s*(\d+)$/i)
    if (match) return parseInt(match[1]) <= visitorCount
    return true
  })

  const getDefiStatus = (defiId) => {
    const r = results.find(r => r.defi_id === defiId)
    return r?.status || 'PENDING'
  }

  const handleMouseDown = useCallback((e, defiName) => {
    if (!calibrating) return
    e.preventDefault()
    setDragging(defiName)
  }, [calibrating])

  const handleMouseMove = useCallback((e) => {
    if (!dragging || !containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setPositions(prev => ({ ...prev, [dragging]: { x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 } }))
  }, [dragging])

  const handleMouseUp = useCallback(() => {
    setDragging(null)
  }, [])

  const handleTouchStart = useCallback((e, defiName) => {
    if (!calibrating) return
    e.preventDefault()
    setDragging(defiName)
  }, [calibrating])

  const handleTouchMove = useCallback((e) => {
    if (!dragging || !containerRef.current) return
    const touch = e.touches[0]
    const rect = containerRef.current.getBoundingClientRect()
    const x = ((touch.clientX - rect.left) / rect.width) * 100
    const y = ((touch.clientY - rect.top) / rect.height) * 100
    setPositions(prev => ({ ...prev, [dragging]: { x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 } }))
  }, [dragging])

  const savePositions = () => {
    localStorage.setItem('defi_positions', JSON.stringify(positions))
    setCalibrating(false)
    alert('Positions sauvegardées !')
  }

  const resetPositions = () => {
    setPositions({ ...DEFAULT_POSITIONS })
    localStorage.removeItem('defi_positions')
  }

  return (
    <div className="relative">
      {/* Calibration toolbar */}
      <div className="flex items-center justify-end gap-2 mb-2">
        {calibrating ? (
          <>
            <span className="text-[10px] font-bold text-orange-500 uppercase tracking-wider animate-pulse mr-auto">
              ⚠ Glissez les marqueurs • Choisissez le nombre de visiteurs
            </span>
            {/* Visitor count selector inside calibration */}
            <div className="flex items-center gap-1.5 mr-2">
              <Users className="w-3 h-3 text-orange-500" />
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Visiteurs:</span>
              {[0, 1, 2, 3, 4].map(n => (
                <button
                  key={n}
                  onClick={() => handleVisitorCount(n)}
                  className={clsx(
                    "w-6 h-6 rounded text-[10px] font-bold transition-all",
                    visitorCount === n
                      ? "bg-orange-500 text-white shadow-sm"
                      : "bg-white text-slate-400 border border-slate-200 hover:border-orange-400"
                  )}
                >{n}</button>
              ))}
            </div>
            <button onClick={resetPositions} className="text-[10px] font-bold text-slate-400 hover:text-slate-600 px-3 py-1.5 rounded border border-slate-200 uppercase tracking-wider">
              Reset
            </button>
            <button onClick={() => { setCalibrating(false); setPositions(loadPositions()) }} className="text-[10px] font-bold text-slate-400 hover:text-rose-500 px-3 py-1.5 rounded border border-slate-200 uppercase tracking-wider flex items-center gap-1">
              <X className="w-3 h-3" /> Annuler
            </button>
            <button onClick={savePositions} className="text-[10px] font-bold text-white bg-emerald-600 hover:bg-emerald-700 px-4 py-1.5 rounded uppercase tracking-wider flex items-center gap-1 shadow-sm">
              <Save className="w-3 h-3" /> Sauvegarder
            </button>
          </>
        ) : (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <Users className="w-3 h-3 text-slate-400" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Visiteurs:</span>
              {[0, 1, 2, 3, 4].map(n => (
                <button
                  key={n}
                  onClick={() => handleVisitorCount(n)}
                  className={clsx(
                    "w-6 h-6 rounded text-[10px] font-bold transition-all",
                    visitorCount === n
                      ? "bg-brand-blue text-white shadow-sm"
                      : "bg-white text-slate-400 border border-slate-200 hover:border-brand-blue"
                  )}
                >{n}</button>
              ))}
            </div>
            <div className="w-px h-5 bg-slate-200" />
            <button
              onClick={() => setCalibrating(true)}
              className="text-[10px] font-bold text-slate-400 hover:text-brand-blue px-3 py-1.5 rounded border border-slate-200 hover:border-brand-blue uppercase tracking-wider flex items-center gap-1.5 transition-colors"
            >
              <Move className="w-3 h-3" /> Calibrer
            </button>
          </div>
        )}
      </div>

      {/* Map container */}
      <div
        ref={containerRef}
        className={clsx(
          "relative w-full rounded-lg border overflow-hidden shadow-sm bg-white",
          calibrating ? "border-orange-400 ring-2 ring-orange-200" : "border-slate-200"
        )}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleMouseUp}
      >
        <img
          src={mapImage}
          alt="Parcours Robotique"
          className="w-full h-auto block select-none pointer-events-none"
          draggable={false}
        />

        {/* Défi markers */}
        {visibleDefis.map((defi) => {
          const pos = positions[defi.name] || { x: 50, y: 50 }
          const status = getDefiStatus(defi.id)
          const isDragging = dragging === defi.name

          return (
            <button
              key={defi.id}
              onClick={() => !calibrating && onSelectDefi(defi)}
              onMouseDown={(e) => handleMouseDown(e, defi.name)}
              onTouchStart={(e) => handleTouchStart(e, defi.name)}
              disabled={!selectedTeamId && !calibrating}
              style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
              className={clsx(
                "absolute -translate-x-1/2 -translate-y-1/2 group/m transition-all z-10",
                isDragging ? "duration-0 scale-150 z-30" : "duration-200",
                calibrating
                  ? "cursor-grab active:cursor-grabbing"
                  : !selectedTeamId
                  ? "opacity-40 cursor-not-allowed"
                  : "hover:scale-[1.5] active:scale-90 cursor-pointer"
              )}
            >
              <div className={clsx(
                "w-8 h-8 rounded-full flex items-center justify-center transition-all border-2 border-white shadow-lg",
                calibrating
                  ? "bg-blue-600 text-white ring-4 ring-blue-300/50"
                  : status === 'PASS'
                  ? "bg-emerald-500 text-white ring-4 ring-emerald-300/40"
                  : status === 'FAIL'
                  ? "bg-rose-500 text-white ring-4 ring-rose-300/40"
                  : "bg-red-500 text-white ring-2 ring-red-300/40 group-hover/m:bg-brand-blue group-hover/m:ring-blue-300/40"
              )}>
                {calibrating && <Move className="w-3.5 h-3.5" />}
                {!calibrating && status === 'PASS' && <CheckCircle2 className="w-4 h-4" />}
                {!calibrating && status === 'FAIL' && <XCircle className="w-4 h-4" />}
                {!calibrating && !status && <MapPin className="w-4 h-4" />}
              </div>

              {/* Label always visible */}
              <div className={clsx(
                "absolute -bottom-7 left-1/2 -translate-x-1/2 text-[7px] font-bold px-2 py-0.5 rounded shadow-lg uppercase tracking-wider whitespace-nowrap pointer-events-none z-30",
                calibrating
                  ? "bg-blue-600 text-white"
                  : status === 'PASS'
                  ? "bg-emerald-600 text-white"
                  : status === 'FAIL'
                  ? "bg-rose-600 text-white"
                  : "bg-[#1e3a8a] text-white"
              )}>
                {defi.name}
              </div>
            </button>
          )
        })}

        {/* Overlay when no team and not calibrating */}
        {!selectedTeamId && !calibrating && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-[1px] z-20">
            <div className="bg-white border border-slate-200 p-5 rounded-lg shadow-2xl flex flex-col items-center gap-3 text-center max-w-[240px]">
              <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center">
                <Info className="w-6 h-6 text-orange-500" />
              </div>
              <h4 className="text-xs font-bold text-[#1e3a8a] uppercase tracking-wider">Parcours Robotique</h4>
              <p className="text-[10px] text-slate-500 leading-relaxed">Sélectionnez une équipe pour activer les défis.</p>
            </div>
          </div>
        )}

        {/* Legend */}
        {!calibrating && (
          <div className="absolute bottom-2 right-3 flex gap-4 bg-white/90 px-3 py-1.5 rounded-full border border-slate-100 shadow-sm z-10">
            <div className="flex items-center gap-1.5 text-[7px] font-bold uppercase tracking-widest text-slate-500">
              <div className="w-2 h-2 rounded-full bg-emerald-500" /> Réussi
            </div>
            <div className="flex items-center gap-1.5 text-[7px] font-bold uppercase tracking-widest text-slate-500">
              <div className="w-2 h-2 rounded-full bg-rose-500" /> Échoué
            </div>
            <div className="flex items-center gap-1.5 text-[7px] font-bold uppercase tracking-widest text-slate-500">
              <div className="w-2 h-2 rounded-full bg-red-500" /> À faire
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
