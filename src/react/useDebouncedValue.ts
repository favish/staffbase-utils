import { useEffect, useState } from 'react'

/**
 * Returns a debounced copy of a value that only updates after it has stopped
 * changing for `delayMs`. Useful for search inputs and other rapid updates.
 * @template T The value type.
 * @param {T} value - The source value.
 * @param {number} delayMs - Quiet period before the debounced value updates.
 * @returns {T} The debounced value.
 */
export const useDebouncedValue = <T>(value: T, delayMs: number): T => {
  const [debounced, setDebounced] = useState<T>(value)

  useEffect(() => {
    const timeoutId = window.setTimeout(() => setDebounced(value), delayMs)
    return () => window.clearTimeout(timeoutId)
  }, [value, delayMs])

  return debounced
}
