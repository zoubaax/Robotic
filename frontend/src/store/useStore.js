import { create } from 'zustand'
import { supabase } from '../lib/supabase'

// Debounce to prevent 429 (too many requests)
let fetchTimer = null
const debouncedFetch = (fn, delay = 1000) => {
  clearTimeout(fetchTimer)
  fetchTimer = setTimeout(fn, delay)
}

export const useStore = create((set, get) => ({
  teams: [],
  defis: [],
  results: [],
  selectedTeamId: null,
  liveTeamId: null,
  visitorCount: 0,
  user: JSON.parse(localStorage.getItem('admin_user') || 'null'),
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

  setSelectedTeam: async (teamId) => {
    set({ selectedTeamId: teamId })
    // Broadcast to live page via database
    console.log('Broadcasting selected team to live:', teamId)
    const { error } = await supabase
      .from('live_state')
      .update({ selected_team_id: teamId, updated_at: new Date().toISOString() })
      .eq('id', 1)
    if (error) console.error('Failed to broadcast live state:', error)
  },

  fetchLiveState: async () => {
    const { data, error } = await supabase
      .from('live_state')
      .select('*')
      .eq('id', 1)
      .maybeSingle()

    if (error) {
      console.error('fetchLiveState error:', error)
      return
    }

    if (!data) {
      // Row doesn't exist yet — create it
      console.log('Creating live_state row...')
      await supabase.from('live_state').insert({ id: 1 })
      return
    }

    console.log('Live state fetched:', data)
    set({ 
      liveTeamId: data.selected_team_id,
      visitorCount: data.visitor_count || 0
    })
  },

  setVisitorCount: async (count) => {
    set({ visitorCount: count })
    await supabase
      .from('live_state')
      .update({ visitor_count: count, updated_at: new Date().toISOString() })
      .eq('id', 1)
  },

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

  login: async (email, password) => {
    const cleanEmail = email.trim()
    const cleanPassword = password.trim()
    
    console.log('Attempting login for:', cleanEmail)

    // 1. HARDCODED FALLBACK (Works even without database)
    if (cleanEmail === 'Admin@robotics.upf' && cleanPassword === 'Urbotics@26') {
      console.log('Login successful via master key!')
      const user = { email: cleanEmail, role: 'admin' }
      localStorage.setItem('admin_user', JSON.stringify(user))
      set({ user })
      return true
    }
    
    // 2. DATABASE CHECK (For other users)
    const { data, error } = await supabase
      .from('admins')
      .select('*')
      .ilike('email', cleanEmail)
      .eq('password', cleanPassword)
      .maybeSingle()

    if (data) {
      console.log('Login successful via database!')
      const user = { email: data.email, role: 'admin' }
      localStorage.setItem('admin_user', JSON.stringify(user))
      set({ user })
      return true
    }
    
    console.warn('Login failed: No matching credentials')
    return false
  },

  logout: () => {
    localStorage.removeItem('admin_user')
    set({ user: null })
  },

  subscribeToChanges: () => {
    const subscription = supabase
      .channel('schema-db-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'teams' }, () => debouncedFetch(() => get().fetchTeams()))
      .on('postgres_changes', { event: '*', schema: 'public', table: 'team_defi_results' }, () => debouncedFetch(() => get().fetchTeams()))
      .on('postgres_changes', { event: '*', schema: 'public', table: 'team_bonus' }, () => debouncedFetch(() => get().fetchTeams()))
      .on('postgres_changes', { event: '*', schema: 'public', table: 'live_state' }, () => get().fetchLiveState())
      .subscribe()

    return () => {
      supabase.removeChannel(subscription)
    }
  }
}))
