/**
 * Per-call options for fetching a channel's articles.
 */
export interface FetchArticlesOptions {
  /**
   * Which posts endpoint to read. `'client'` uses `/client/channels/:id/posts`
   * (the client-facing read path); `'channel'` (default) uses
   * `/channels/:id/posts`.
   */
  scope?: 'client' | 'channel'
  /**
   * When true, first reads the channel and returns an empty list if the channel
   * itself is not yet published. Off by default.
   */
  requireChannelPublished?: boolean
  /**
   * When true, returns posts regardless of their publication window (used by
   * configuration selectors that list every article). When false (default),
   * only currently-published posts are returned.
   */
  includeUnpublished?: boolean
  /** When true, appends `includeDrafts=true` to each request. Off by default. */
  includeDrafts?: boolean
}
