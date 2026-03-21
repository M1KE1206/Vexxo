import { useReducedMotion as useFramerReducedMotion } from 'framer-motion'

/**
 * Returns true when the user prefers reduced motion.
 * Wraps framer-motion's hook for a consistent import path per CLAUDE.md.
 */
export function useReducedMotion() {
  return useFramerReducedMotion()
}
