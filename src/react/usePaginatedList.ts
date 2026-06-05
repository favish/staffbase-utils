import { useCallback, useEffect, useMemo, useState } from 'react'
import type { UsePaginatedListReturn } from '../types/react/UsePaginatedListReturn'

/**
 * Client-side "load more" pagination over an in-memory list.
 *
 * Reveals `pageSize` items at a time and collapses back to the first page
 * whenever `resetKey` changes (e.g. the selected channel or language), matching
 * the alerts/unacknowledged-bulletins list behavior.
 * @template T The list item type.
 * @param {T[]} items - The full list.
 * @param {number} pageSize - Items revealed per page.
 * @param {unknown} [resetKey] - When it changes, pagination resets to page one.
 * @returns {UsePaginatedListReturn<T>} The visible slice and controls.
 */
export const usePaginatedList = <T>(
  items: T[],
  pageSize: number,
  resetKey?: unknown,
): UsePaginatedListReturn<T> => {
  const [count, setCount] = useState<number>(pageSize)

  useEffect(() => {
    setCount(pageSize)
  }, [resetKey, pageSize])

  const visible = useMemo(() => items.slice(0, count), [items, count])
  const loadMore = useCallback(
    () => setCount((current) => current + pageSize),
    [pageSize],
  )
  const reset = useCallback(() => setCount(pageSize), [pageSize])

  return { visible, canLoadMore: count < items.length, loadMore, reset }
}
