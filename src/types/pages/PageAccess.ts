/**
 * An access-control descriptor on a page. Used verbatim for each of a page's
 * `readers`, `admins` and `owners` fields.
 *
 * Curated from a live prod read of all 1104 pages on the teamaag tenant.
 * `branchAccess` was present on every object (1104/1104) and indicates whether
 * the page is accessible to the whole platform branch. The id lists are
 * conditional: across readers/admins/owners, `userIds`, `groupIds` and
 * `tokenIds` each appeared only when non-empty (e.g. `readers.groupIds`
 * 430/1104, `readers.tokenIds` 6/1104), so all three are optional. The official
 * Pages API spec (`PageResponseSchema.readers`/`.admins`) documents the same
 * subfields but omits the `owners` object entirely.
 */
export interface PageAccess {
  branchAccess: boolean
  userIds?: string[]
  groupIds?: string[]
  tokenIds?: string[]
}
