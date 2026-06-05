import type { PaginationCursor } from '../types/pagination/PaginationCursor'

/**
 * Decodes a base64 pagination cursor token into a PaginationCursor.
 *
 * Browser-oriented: uses `atob` (always defined in the host page / mobile
 * webview). Returns null for a missing token, malformed base64/JSON, or an
 * object lacking `id`/`createdAt`. Fails silently (the library never logs) so
 * callers handle the null however they like.
 * @param {string | null | undefined} base64Cursor - The encoded cursor token.
 * @returns {PaginationCursor | null} The decoded cursor, or null when invalid.
 */
export const decodeCursor = (
  base64Cursor: string | null | undefined,
): PaginationCursor | null => {
  if (!base64Cursor) return null

  try {
    const cursor = JSON.parse(atob(base64Cursor)) as unknown
    if (
      typeof cursor === 'object' &&
      cursor !== null &&
      'createdAt' in cursor &&
      'id' in cursor
    ) {
      return {
        createdAt: String((cursor as PaginationCursor).createdAt),
        id: String((cursor as PaginationCursor).id),
      }
    }
  } catch {
    // Malformed token: treat as no cursor.
  }

  return null
}
