import { useState, useEffect, useRef } from 'react'
import { useInView } from 'framer-motion'

/**
 * Animates a number from 0 to `target` when the returned ref enters viewport.
 * Duration: 1.5s, easing: cubic easeOut.
 *
 * @param {number} target - The final number to count to
 * @param {{ disabled?: boolean }} options
 * @returns {{ ref: React.RefObject, count: number }}
 */
export function useCountUp(target, { disabled = false } = {}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  const [count, setCount] = useState(disabled ? target : 0)

  useEffect(() => {
    if (!isInView || disabled) return
    const duration = 1500
    const start = performance.now()
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3) // cubic easeOut
      setCount(Math.round(target * eased))
      if (progress < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [isInView, disabled, target])

  return { ref, count }
}
