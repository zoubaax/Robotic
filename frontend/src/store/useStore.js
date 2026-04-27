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

    // Fetch teams with defi results
    const { data: teamsData, error: teamsError } = await supabase
      .from('teams')
      .select('*, team_defi_results(*)')
      .order('name')

    // Fetch bonuses separately (join may not work after table recreation)
    const { data: bonusData } = await supabase
      .from('team_bonus')
      .select('*')

    if (teamsError) {
      set({ error: teamsError.message, loading: false })
      return
    }

    // Merge bonus data into teams
    const teams = (teamsData || []).map(team => {
      const bonus = (bonusData || []).filter(b => b.team_id === team.id)
      return { ...team, team_bonus: bonus }
    })

    set({ teams, loading: false })
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
    const payload = {
      team_id: teamId,
      presentation_points: bonusData.presentation_points || 0,
      design_points: bonusData.design_points || 0,
      mission_points: bonusData.mission_points || 0
    }
    console.log('Saving bonus:', payload)

    const { data, error } = await supabase
      .from('team_bonus')
      .upsert(payload)
      .select()

    console.log('Bonus save result:', { data, error })

    if (error) {
      console.error('updateBonus error:', error)
      set({ error: error.message })
      return false
    }
    if (!data || data.length === 0) {
      console.error('updateBonus: No data returned — write was blocked by RLS')
      set({ error: 'Write blocked — run GRANT ALL ON team_bonus TO anon; in Supabase SQL' })
      return false
    }

    // Update local state immediately with the saved bonus data
    const teams = get().teams.map(t => {
      if (t.id === teamId) {
        return { ...t, team_bonus: [data[0]] }
      }
      return t
    })
    set({ teams })

    // Also refresh from server
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
