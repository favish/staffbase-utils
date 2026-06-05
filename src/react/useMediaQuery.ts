import { useEffect, useState } from 'react'

/**
 * Tracks whether a CSS media query currently matches, updating on change.
 *
 * SSR-safe: returns false when there is no `window`. Subscribes to the query's
 * change event and cleans up on unmount or when the query string changes.
 * @param {string} query - A media query string (e.g. `'(max-width: 768px)'`).
 * @returns {boolean} True while the query matches.
 */
export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState<boolean>(() =>
    typeof window === 'undefined' ? false : window.matchMedia(query).matches,
  )

  useEffect(() => {
    if (typeof window === 'undefined') return

    const mediaQuery = window.matchMedia(query)
    setMatches(mediaQuery.matches)

    const controller = new AbortController()
    mediaQuery.addEventListener(
      'change',
      (event) => setMatches(event.matches),
      { signal: controller.signal },
    )
    return () => controller.abort()
  }, [query])

  return matches
}
