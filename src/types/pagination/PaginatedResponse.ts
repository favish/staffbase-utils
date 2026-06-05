import type { PaginationCursor } from './PaginationCursor'

/**
 * Wrapper for a page of a cursor-paginated collection.
 * @template T The item type.
 */
export interface PaginatedResponse<T> {
  /** The items on this page. */
  items: T[]
  /** Cursor for the next page, or null when there are no more pages. */
  nextCursor: PaginationCursor | null
  /** Cursor for the previous page, or null when there is no previous page. */
  prevCursor: PaginationCursor | null
  /** Whether more items remain after this page. */
  hasMore: boolean
  /** Optional total count, for display. */
  totalCount?: number
}
