/**
 * Acknowledgement counters on a news post. Present only when the post carries
 * acknowledgement data (rare: 1 of 584 prod posts had it).
 *
 * Grounded in a live prod read: `{ total, limit, offset }` — a paginated
 * counter, NOT `{ isAcknowledged, total }` as the hand-rolled `ArticleData`
 * wrongly assumed.
 */
export interface PostAcknowledgements {
  total: number
  limit: number
  offset: number
}
