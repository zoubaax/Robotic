import { useState, useEffect } from 'react'

export default function LiveTimer({ startTime, endTime }) {
  const [now, setNow] = useState(Date.now())

  // Tick every second while running (has start but no end)
  useEffect(() => {
    if (!startTime || endTime) return

    const interval = setInterval(() => {
      setNow(Date.now())
    }, 100)

    return () => clearInterval(interval)
  }, [startTime, endTime])

  if (!startTime) return <span>00:00:00</span>

  const start = new Date(startTime).getTime()
  const end = endTime ? new Date(endTime).getTime() : now
  const diff = Math.max(0, end - start)

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
