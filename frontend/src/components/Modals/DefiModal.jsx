import { useState } from 'react'
import { useStore } from '../../store/useStore'
import { calculatePoints } from '../../utils/stats'
import { X, Check, AlertCircle, Users, Activity } from 'lucide-react'
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-brand-navy/40 backdrop-blur-sm transition-opacity animate-in fade-in" onClick={onClose} />
      
      <div className="relative bg-white border border-slate-200 rounded-lg w-full max-w-lg overflow-hidden shadow-[0_32px_64px_-12px_rgba(30,58,138,0.3)] animate-in zoom-in-95 duration-300">
        <div className="bg-brand-navy p-8 text-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase font-bold tracking-[0.4em] text-white/60">Module Assessment</span>
            <button onClick={onClose} className="p-1 hover:bg-white/10 rounded transition-colors text-white/60 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>
          <h3 className="text-3xl font-semibold italic">{defi.name}</h3>
          <p className="text-white/60 text-xs font-bold uppercase tracking-widest mt-4 flex items-center gap-2">
            <Activity className="w-3 h-3" />
            Standard Value: {defi.base_points} Points
          </p>
        </div>

        <div className="p-8 space-y-8">
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setStatus('PASS')}
              className={clsx(
                "py-5 rounded border-2 flex flex-col items-center gap-3 transition-all",
                status === 'PASS' 
                  ? "bg-emerald-50 border-emerald-500 text-emerald-600 shadow-sm" 
                  : "bg-white border-slate-100 text-slate-400 hover:border-slate-200"
              )}
            >
              <Check className="w-6 h-6" />
              <span className="font-bold uppercase tracking-[0.2em] text-[10px]">Accomplished</span>
            </button>

            <button
              onClick={() => setStatus('FAIL')}
              className={clsx(
                "py-5 rounded border-2 flex flex-col items-center gap-3 transition-all",
                status === 'FAIL' 
                  ? "bg-rose-50 border-rose-500 text-rose-600 shadow-sm" 
                  : "bg-white border-slate-100 text-slate-400 hover:border-slate-200"
              )}
            >
              <X className="w-6 h-6" />
              <span className="font-bold uppercase tracking-[0.2em] text-[10px]">Unsuccessful</span>
            </button>
          </div>

          {defi.type === 'visitor-based' && status === 'PASS' && (
            <div className="bg-brand-light p-6 rounded border border-slate-200">
              <label className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">
                <Users className="w-3.5 h-3.5 text-brand-blue" />
                Visitor Count Metric
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="number"
                  min="0"
                  value={visitors}
                  onChange={(e) => setVisitors(parseInt(e.target.value) || 0)}
                  className="w-full bg-white border border-slate-200 rounded px-5 py-3 text-brand-navy focus:outline-none focus:border-brand-blue transition-all text-2xl font-bold text-center"
                />
                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Yield</span>
                  <span className="text-xl font-bold text-brand-blue">{visitors * 15} pts</span>
                </div>
              </div>
            </div>
          )}

          <div className="flex items-start gap-4 p-5 bg-brand-light border border-slate-200 rounded text-slate-500 text-xs leading-relaxed">
            <AlertCircle className="w-4 h-4 text-brand-blue flex-shrink-0 mt-0.5" />
            <p>Data integrity: Submission will immediately synchronize with the central leaderboard and update academic rankings.</p>
          </div>
        </div>

        <div className="p-8 pt-0">
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full bg-brand-navy hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded text-xs uppercase tracking-[0.2em] transition-all shadow-xl shadow-brand-navy/10 active:scale-[0.98]"
          >
            {saving ? 'Synchronizing...' : 'Submit Records'}
          </button>
        </div>
      </div>
    </div>
  )
}
