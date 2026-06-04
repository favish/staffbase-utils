/**
 * Comment summary on a news post. Present only on posts with comment data
 * (255 of 584 prod posts).
 *
 * Grounded in a live prod read: `{ total, rights }`.
 */
export interface PostComments {
  total: number
  rights: string[]
}
