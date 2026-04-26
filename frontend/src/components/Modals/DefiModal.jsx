import { useState, useEffect } from 'react'
import { useStore } from '../../store/useStore'
import { calculatePoints } from '../../utils/stats'
import { X, Check, AlertCircle, Users } from 'lucide-react'
import { clsx } from 'clsx'

export default function DefiModal({ defi, onClose }) {
  const { selectedTeamId, teams, updateResult } = useStore()
  const team = teams.find(t => t.id === selectedTeamId)
  const result = team?.team_defi_results?.find(r => r.defi_id === defi.id)

  const [status, setStatus] = useState(result?.status || 'PASS')
  const [visitors, setVisitors] = useState(result?.visitors_count || 0)
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    const points = calculatePoints(defi, status, visitors)
    const success = await updateResult(selectedTeamId, defi.id, status, visitors, points)
    if (success) onClose()
    setSaving(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-2xl font-bold text-white">{defi.name}</h3>
              <p className="text-slate-400 text-sm">{defi.base_points} pts de base • {defi.type}</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full text-slate-400 transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-6">
            <div className="flex gap-4">
              <button
                onClick={() => setStatus('PASS')}
                className={clsx(
                  "flex-1 py-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all",
                  status === 'PASS' 
                    ? "bg-emerald-500/20 border-emerald-500 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.1)]" 
                    : "bg-slate-800/50 border-slate-700 text-slate-500 hover:border-slate-600"
                )}
              >
                <Check className="w-8 h-8" />
                <span className="font-bold uppercase tracking-widest text-xs">RÉUSSI</span>
              </button>

              <button
                onClick={() => setStatus('FAIL')}
                className={clsx(
                  "flex-1 py-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all",
                  status === 'FAIL' 
                    ? "bg-rose-500/20 border-rose-500 text-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.1)]" 
                    : "bg-slate-800/50 border-slate-700 text-slate-500 hover:border-slate-600"
                )}
              >
                <X className="w-8 h-8" />
                <span className="font-bold uppercase tracking-widest text-xs">ÉCHOUÉ</span>
              </button>
            </div>

            {defi.type === 'visitor-based' && status === 'PASS' && (
              <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-3">
                  <Users className="w-4 h-4 text-indigo-400" />
                  Nombre de visiteurs
                </label>
                <input
                  type="number"
                  min="0"
                  value={visitors}
                  onChange={(e) => setVisitors(parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all text-2xl font-bold text-center"
                />
                <p className="text-right mt-2 text-xs font-bold text-indigo-400">
                  Total: {visitors * 15} pts
                </p>
              </div>
            )}

            <div className="flex items-center gap-3 p-4 bg-indigo-500/5 border border-indigo-500/20 rounded-xl text-indigo-300/80 text-sm">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p>Le résultat sera mis à jour en temps réel sur le tableau de bord.</p>
            </div>
          </div>
        </div>

        <div className="p-6 bg-slate-800/30 border-t border-slate-800">
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-indigo-500/20 active:scale-[0.98]"
          >
            {saving ? 'Enregistrement...' : 'Confirmer le Résultat'}
          </button>
        </div>
      </div>
    </div>
  )
}
