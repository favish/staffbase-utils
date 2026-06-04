/**
 * Options for fetchAllPaginated.
 * @template TItem The mapped item type returned to the caller.
 * @template TSource The raw item type returned by the API before mapping.
 */
export interface FetchAllPaginatedOptions<TItem, TSource = TItem> {
  /**
   * Maps/filters each raw API item. Return null to drop an item. When omitted,
   * raw items are returned unchanged (TSource is assumed assignable to TItem).
   * @param {TSource} item - The raw item from the API page.
   * @returns {TItem | null} The mapped item, or null to skip it.
   */
  mapItem?: (item: TSource) => TItem | null
  /** Page size requested per call (default 50). */
  limit?: number
  /** When true, appends `includeDrafts=true` to each request URL. */
  includeDrafts?: boolean
  /**
   * Hard cap on the number of pages fetched (default 1000), a runaway backstop.
   * Lower it to bound first-paint latency on very large collections.
   */
  maxPages?: number
  /**
   * Called with a diagnostic message when the maxPages cap is hit (so truncation
   * is never silent). Injected because the library does not log directly.
   * @param {string} message - The truncation diagnostic message.
   * @returns {void} Nothing.
   */
  onError?: (message: string) => void
}
