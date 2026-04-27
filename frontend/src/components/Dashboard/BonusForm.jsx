import { useState, useEffect } from 'react'
import { useStore } from '../../store/useStore'
import { Save, Users, Layout, Target, CheckCircle2 } from 'lucide-react'
import { clsx } from 'clsx'

export default function BonusForm() {
  const { selectedTeamId, teams, updateBonus } = useStore()
  const team = teams.find(t => t.id === selectedTeamId)
  const bonus = team?.team_bonus?.[0] || { presentation_points: 0, design_points: 0, mission_points: 0 }

  const [values, setValues] = useState({
    presentation_points: bonus.presentation_points,
    design_points: bonus.design_points,
    mission_points: bonus.mission_points
  })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [saveError, setSaveError] = useState(null)

  // Sync values when team changes or data updates from Supabase
  useEffect(() => {
    setValues({
      presentation_points: bonus.presentation_points,
      design_points: bonus.design_points,
      mission_points: bonus.mission_points
    })
    setSaved(false)
    setSaveError(null)
  }, [selectedTeamId, bonus.presentation_points, bonus.design_points, bonus.mission_points])

  const handleSave = async () => {
    setSaving(true)
    setSaveError(null)
    const success = await updateBonus(selectedTeamId, values)
    setSaving(false)
    if (success) {
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } else {
      setSaveError("Échec de l'enregistrement. Vérifiez votre connexion ou le SQL Supabase.")
    }
  }

  if (!selectedTeamId) return null

  const total = values.presentation_points + values.design_points + values.mission_points

  return (
    <div className="bg-brand-light border border-slate-200 rounded-lg p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <span className="text-[11px] uppercase tracking-[0.3em] font-bold text-brand-blue mb-2 block">Évaluation Finale</span>
          <h2 className="text-xl font-semibold text-brand-navy">
            Bonus pour <span className="text-brand-blue">"{team.name}"</span>
          </h2>
        </div>
        <div className="text-right">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Bonus</span>
          <span className="text-3xl font-bold text-brand-navy">{total} <span className="text-sm text-slate-400">pts</span></span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <BonusInput
          icon={<Users className="w-4 h-4" />}
          label="Présentation"
          max={10}
          value={values.presentation_points}
          onChange={(v) => setValues(prev => ({ ...prev, presentation_points: v }))}
        />
        <BonusInput
          icon={<Layout className="w-4 h-4" />}
          label="Design"
          max={15}
          value={values.design_points}
          onChange={(v) => setValues(prev => ({ ...prev, design_points: v }))}
        />
        <BonusInput
          icon={<Target className="w-4 h-4" />}
          label="Mission"
          max={10}
          value={values.mission_points}
          onChange={(v) => setValues(prev => ({ ...prev, mission_points: v }))}
        />
      </div>

      <div className="flex flex-col gap-4">
        <button
          onClick={handleSave}
          disabled={saving}
          className={clsx(
            "flex items-center gap-3 font-bold py-3.5 px-8 rounded transition-all active:scale-95 shadow-lg",
            saved
              ? "bg-emerald-600 text-white shadow-emerald-600/10"
              : saveError
              ? "bg-rose-600 text-white shadow-rose-600/10"
              : "bg-brand-navy text-white hover:bg-slate-800 shadow-brand-navy/10"
          )}
        >
          {saved ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          <span className="text-xs uppercase tracking-widest">
            {saving ? 'Enregistrement...' : saved ? 'Sauvegardé !' : 'Sauvegarder'}
          </span>
        </button>

        {saveError && (
          <p className="text-rose-500 text-[10px] font-bold uppercase tracking-wider animate-pulse">
            ⚠ {saveError}
          </p>
        )}
      </div>
    </div>
  )
}

function BonusInput({ icon, label, max, value, onChange }) {
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-5">
      <label className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
        {icon}
        {label}
      </label>
      {/* Quick select */}
      <div className="flex gap-1.5 mb-3">
        {Array.from({ length: max + 1 }, (_, i) => i).filter(n => n % (max <= 10 ? 2 : 3) === 0 || n === max).map(n => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            className={clsx(
              "flex-1 py-1.5 rounded text-[10px] font-bold transition-all",
              value === n
                ? "bg-brand-blue text-white shadow-sm"
                : "bg-slate-50 text-slate-400 hover:bg-slate-100"
            )}
          >{n}</button>
        ))}
      </div>
      {/* Slider-like input */}
      <div className="relative">
        <input
          type="range"
          min="0"
          max={max}
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value))}
          className="w-full accent-brand-blue"
        />
        <div className="flex justify-between mt-1">
          <span className="text-[9px] text-slate-300 font-bold">0</span>
          <span className="text-lg font-bold text-brand-navy">{value}<span className="text-[10px] text-slate-400 ml-1">/{max}</span></span>
          <span className="text-[9px] text-slate-300 font-bold">{max}</span>
        </div>
      </div>
    </div>
  )
}
