/**
 * Like counters on a news post.
 *
 * Grounded in a live post read (`GET /api/posts/{id}`), which returns
 * `"likes": { "total": <number> }`. Note this is `likes.total`, not a flat
 * `likesCount` field (the hand-rolled `ArticleData` had the latter, which does
 * not exist on the real payload).
 */
export interface PostLikes {
  total: number
}
