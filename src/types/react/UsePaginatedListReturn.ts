/**
 * Return value of usePaginatedList.
 * @template T The list item type.
 */
export interface UsePaginatedListReturn<T> {
  /** The currently visible slice of items. */
  visible: T[]
  /** Whether more items remain to reveal. */
  canLoadMore: boolean
  /**
   * Reveals the next page of items.
   * @returns {void} Nothing.
   */
  loadMore: () => void
  /**
   * Collapses back to the first page.
   * @returns {void} Nothing.
   */
  reset: () => void
}
