import { useState } from 'react'
import { useStore } from '../../store/useStore'
import { Star, Layout, Rocket, Save } from 'lucide-react'

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
    <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 shadow-xl">
      <div className="flex items-center gap-3 mb-6">
        <Star className="text-amber-500 w-6 h-6 fill-amber-500/20" />
        <h2 className="text-xl font-bold text-white">Points Bonus (Fin de Parcours)</h2>
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
          icon={<Rocket className="w-4 h-4" />}
          label="Mission"
          max={10}
          value={values.mission_points}
          onChange={(v) => setValues(prev => ({ ...prev, mission_points: v }))}
        />
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 rounded-xl border border-slate-700 transition-all active:scale-[0.98]"
      >
        <Save className="w-4 h-4" />
        {saving ? 'Enregistrement...' : 'Enregistrer les Bonus'}
      </button>
    </div>
  )
}

function BonusInput({ icon, label, max, value, onChange }) {
  return (
    <div className="space-y-3">
      <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
        {icon}
        {label} (max {max})
      </label>
      <div className="relative">
        <input
          type="number"
          min="0"
          max={max}
          value={value}
          onChange={(e) => onChange(Math.min(max, Math.max(0, parseInt(e.target.value) || 0)))}
          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white font-bold focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
        />
        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 text-xs font-bold">
          / {max}
        </div>
      </div>
    </div>
  )
}

import { Users } from 'lucide-react'
