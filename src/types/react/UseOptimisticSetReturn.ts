/**
 * Return value of useOptimisticSet.
 */
export interface UseOptimisticSetReturn {
  /** The current set of ids, including any optimistically added ones. */
  ids: ReadonlySet<string>
  /**
   * Tests membership.
   * @param {string} id - The id to check.
   * @returns {boolean} True when present.
   */
  has: (id: string) => boolean
  /**
   * Optimistically adds `id`, runs `commit`, and rolls the addition back if
   * `commit` resolves false or throws.
   * @param {string} id - The id to add.
   * @param {() => Promise<boolean>} commit - The persistence action; true on success.
   * @returns {Promise<boolean>} Whether the change was kept.
   */
  add: (id: string, commit: () => Promise<boolean>) => Promise<boolean>
}
