export const calculatePoints = (defi, status, visitorsCount = 0) => {
  if (status === 'FAIL') return 0
  
  if (defi.type === 'visitor-based') {
    return 15 * (Number(visitorsCount) || 0)
  }
  
  return defi.base_points
}

export const formatDuration = (start, end) => {
  if (!start || !end) return '--:--'
  const startTime = new Date(start)
  const endTime = new Date(end)
  const diff = Math.max(0, endTime - startTime)
  
  const minutes = Math.floor(diff / 60000)
  const seconds = Math.floor((diff % 60000) / 1000)
  
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}

export const getTeamStats = (team) => {
  const results = team.team_defi_results || []
  const bonus = team.team_bonus?.[0] || { presentation_points: 0, design_points: 0, mission_points: 0 }
  
  const defiPoints = results.reduce((sum, res) => sum + (res.points_earned || 0), 0)
  const bonusPoints = (bonus.presentation_points || 0) + (bonus.design_points || 0) + (bonus.mission_points || 0)
  
  const totalPoints = defiPoints + bonusPoints
  
  const startTime = team.start_time ? new Date(team.start_time) : null
  const endTime = team.end_time ? new Date(team.end_time) : null
  const totalTimeMs = (startTime && endTime) ? Math.max(0, endTime - startTime) : Infinity
  
  return {
    totalPoints,
    totalTimeMs,
    defiPoints,
    bonusPoints
  }
}
