import { create } from 'zustand'
import { supabase } from '../lib/supabase'

export const useStore = create((set, get) => ({
  teams: [],
  defis: [],
  results: [],
  selectedTeamId: null,
  loading: false,
  error: null,

  fetchTeams: async () => {
    set({ loading: true })
    const { data, error } = await supabase
      .from('teams')
      .select(`
        *,
        team_defi_results(*),
        team_bonus(*)
      `)
      .order('name')
    
    if (error) set({ error: error.message, loading: false })
    else set({ teams: data, loading: false })
  },

  fetchDefis: async () => {
    const { data, error } = await supabase.from('defis').select('*').order('name')
    if (error) set({ error: error.message })
    else set({ defis: data })
  },

  setSelectedTeam: (teamId) => set({ selectedTeamId: teamId }),

  updateResult: async (teamId, defiId, status, visitorsCount, points) => {
    const { error } = await supabase
      .from('team_defi_results')
      .upsert({
        team_id: teamId,
        defi_id: defiId,
        status,
        visitors_count: visitorsCount,
        points_earned: points,
        updated_at: new Date().toISOString()
      }, { onConflict: 'team_id,defi_id' })

    if (error) {
      set({ error: error.message })
      return false
    }
    await get().fetchTeams()
    return true
  },

  updateBonus: async (teamId, bonusData) => {
    const { error } = await supabase
      .from('team_bonus')
      .upsert({
        team_id: teamId,
        ...bonusData,
        updated_at: new Date().toISOString()
      })

    if (error) {
      set({ error: error.message })
      return false
    }
    await get().fetchTeams()
    return true
  },

  updateTeamTime: async (teamId, field, value) => {
    const { error } = await supabase
      .from('teams')
      .update({ [field]: value })
      .eq('id', teamId)

    if (error) {
      set({ error: error.message })
      return false
    }
    await get().fetchTeams()
    return true
  },

  addTeam: async (name) => {
    const { data, error } = await supabase
      .from('teams')
      .insert({ name })
      .select()
    
    if (error) {
      set({ error: error.message })
      return null
    }
    await get().fetchTeams()
    return data[0]
  },

  subscribeToChanges: () => {
    const teamsSubscription = supabase
      .channel('schema-db-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'teams' }, () => get().fetchTeams())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'team_defi_results' }, () => get().fetchTeams())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'team_bonus' }, () => get().fetchTeams())
      .subscribe()

    return () => {
      supabase.removeChannel(teamsSubscription)
    }
  }
}))
