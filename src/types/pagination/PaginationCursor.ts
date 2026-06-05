/**
 * An opaque cursor identifying a position in a cursor-paginated collection,
 * decoded from the API's base64 cursor token.
 */
export interface PaginationCursor {
  /** Creation timestamp of the boundary item. */
  createdAt: string
  /** Id of the boundary item. */
  id: string
}
