import { useState, useEffect } from 'react'

export default function LiveTimer({ startTime, endTime, pausedAt, totalPausedMs = 0 }) {
  const [now, setNow] = useState(Date.now())

  // Tick while running (has start, no end, and NOT paused)
  useEffect(() => {
    if (!startTime || endTime || pausedAt) return

    const interval = setInterval(() => {
      setNow(Date.now())
    }, 100)

    return () => clearInterval(interval)
  }, [startTime, endTime, pausedAt])

  if (!startTime) return <span>00:00:00</span>

  const start = new Date(startTime).getTime()
  const end = endTime 
    ? new Date(endTime).getTime() 
    : (pausedAt ? new Date(pausedAt).getTime() : now)
    
  // Subtract total paused duration
  const diff = Math.max(0, end - start - (totalPausedMs || 0))

  const hours = Math.floor(diff / 3600000)
  const minutes = Math.floor((diff % 3600000) / 60000)
  const seconds = Math.floor((diff % 60000) / 1000)

  return (
    <span>
      {hours.toString().padStart(2, '0')}:
      {minutes.toString().padStart(2, '0')}:
      {seconds.toString().padStart(2, '0')}
    </span>
  )
}
