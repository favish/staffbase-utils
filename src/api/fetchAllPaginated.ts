import type { FetchAllPaginatedOptions } from '../types/api/FetchAllPaginatedOptions'
import { fetchJson } from './fetchJson'

const DEFAULT_LIMIT = 50
const DEFAULT_MAX_PAGES = 1000

/**
 * Fetches every page of a Staffbase `{ data, total }` collection endpoint.
 *
 * Termination is driven by page contents (a short page ends the loop) rather
 * than the API's reported `total`, which avoids under-fetching when `total` is
 * under-reported. A `maxPages` cap bounds worst-case latency/memory; reaching it
 * invokes `onError` so the truncation is never silent.
 * @template TItem The mapped item type returned to the caller.
 * @template TSource The raw item type returned by the API before mapping.
 * @param {string} baseUrl - The base API URL (without limit/offset parameters).
 * @param {FetchAllPaginatedOptions<TItem, TSource>} [options] - Mapping and pagination options.
 * @returns {Promise<TItem[]>} All fetched (and optionally mapped) items.
 */
export const fetchAllPaginated = async <TItem, TSource = TItem>(
  baseUrl: string,
  options: FetchAllPaginatedOptions<TItem, TSource> = {},
): Promise<TItem[]> => {
  const {
    mapItem,
    limit = DEFAULT_LIMIT,
    includeDrafts = false,
    maxPages = DEFAULT_MAX_PAGES,
    onError,
  } = options

  const results: TItem[] = []
  let offset = 0
  let page = 0

  while (page < maxPages) {
    const separator = baseUrl.includes('?') ? '&' : '?'
    const draftsParam = includeDrafts ? '&includeDrafts=true' : ''
    const url = `${baseUrl}${separator}limit=${limit}&offset=${offset}${draftsParam}`

    const data = await fetchJson<{ data: TSource[]; total?: number }>(url)
    const rawItems = data.data ?? []

    if (rawItems.length === 0) break

    const mapped = mapItem
      ? rawItems.map(mapItem).filter((item): item is TItem => item !== null)
      : (rawItems as unknown as TItem[])

    results.push(...mapped)

    // A short page means we reached the end of the collection.
    if (rawItems.length < limit) break

    offset += limit
    page += 1
  }

  if (page >= maxPages) {
    onError?.(
      `Pagination cap (${maxPages} pages) reached for ${baseUrl}; results may be truncated.`,
    )
  }

  return results
}
