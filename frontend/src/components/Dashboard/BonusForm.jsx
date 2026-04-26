import { useState } from 'react'
import { useStore } from '../../store/useStore'
import { Star, Layout, Rocket, Save, Users, Target } from 'lucide-react'
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

  const handleSave = async () => {
    setSaving(true)
    await updateBonus(selectedTeamId, values)
    setSaving(false)
  }

  if (!selectedTeamId) return null

  return (
    <div className="bg-brand-light border border-slate-200 rounded p-10">
      <div className="grid md:grid-cols-[1fr_auto] gap-12 items-start">
        <div>
          <div className="mb-8">
            <span className="text-[11px] uppercase tracking-[0.3em] font-bold text-brand-blue mb-4 block">Final Evaluation</span>
            <h2 className="text-3xl font-semibold text-brand-navy leading-tight italic max-w-lg">
              Perform academic assessment for <span className="text-brand-blue underline decoration-slate-300 underline-offset-8">"{team.name}"</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
            <BonusInput
              icon={<Users className="w-4 h-4" />}
              label="Presentation"
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

          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-3 bg-brand-navy text-white font-bold py-3.5 px-8 rounded transition-all hover:bg-slate-800 active:scale-95 shadow-lg shadow-brand-navy/10"
          >
            <Save className="w-4 h-4" />
            <span className="text-xs uppercase tracking-widest">{saving ? 'Processing...' : 'Submit Evaluation'}</span>
          </button>
        </div>

        <div className="hidden lg:block text-8xl font-bold text-brand-blue/10 leading-none select-none">
          02
        </div>
      </div>
    </div>
  )
}

function BonusInput({ icon, label, max, value, onChange }) {
  return (
    <div className="space-y-4">
      <label className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
        {icon}
        {label}
      </label>
      <div className="relative group">
        <input
          type="number"
          min="0"
          max={max}
          value={value}
          onChange={(e) => onChange(Math.min(max, Math.max(0, parseInt(e.target.value) || 0)))}
          className="w-full bg-white border border-slate-200 rounded px-4 py-3.5 text-brand-navy font-bold focus:outline-none focus:border-brand-blue transition-all text-xl"
        />
        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 text-[10px] font-bold uppercase tracking-tighter">
          / {max} <span className="ml-1">MAX</span>
        </div>
      </div>
    </div>
  )
}
