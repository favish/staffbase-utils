import { useMediaQuery } from './useMediaQuery'

/**
 * Whether the user has requested reduced motion
 * (`prefers-reduced-motion: reduce`). Use it to skip or shorten animations.
 * @returns {boolean} True when reduced motion is preferred.
 */
export const useReducedMotion = (): boolean =>
  useMediaQuery('(prefers-reduced-motion: reduce)')
