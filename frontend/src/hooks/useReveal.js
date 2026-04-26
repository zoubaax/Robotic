import { useEffect } from 'react'

export const useReveal = () => {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-visible')
          entry.target.classList.remove('reveal-hidden')
        }
      })
    }, { threshold: 0.1 })

    const elements = document.querySelectorAll('.reveal-element')
    elements.forEach(el => {
      el.classList.add('reveal-hidden')
      observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])
}
