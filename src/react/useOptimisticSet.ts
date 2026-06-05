import { useCallback, useState } from 'react'
import type { UseOptimisticSetReturn } from '../types/react/UseOptimisticSetReturn'

/**
 * Manages a set of ids with optimistic add-and-rollback.
 *
 * Generalizes the alerts/unacknowledged-bulletins acknowledgement flow: an item
 * is hidden immediately by adding its id, the persistence call runs, and the id
 * is removed again if the call reports failure - so a failed write never leaves
 * a permanently hidden item.
 * @returns {UseOptimisticSetReturn} The set, membership test, and optimistic add.
 */
export const useOptimisticSet = (): UseOptimisticSetReturn => {
  const [ids, setIds] = useState<Set<string>>(() => new Set())

  const has = useCallback((id: string): boolean => ids.has(id), [ids])

  const add = useCallback(
    async (id: string, commit: () => Promise<boolean>): Promise<boolean> => {
      setIds((prev) => new Set(prev).add(id))

      const kept = await commit().catch(() => false)
      if (!kept) {
        setIds((prev) => {
          const next = new Set(prev)
          next.delete(id)
          return next
        })
      }

      return kept
    },
    [],
  )

  return { ids, has, add }
}
