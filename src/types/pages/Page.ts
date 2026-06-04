import type { PageAccess } from './PageAccess'
import type { PageContent } from './PageContent'

/**
 * A page as returned by the Staffbase Pages read endpoints (the items of
 * `GET /api/pages` and the single `GET /api/pages/{pageId}`).
 *
 * Curated, not a thin alias of the generated `PageResponseSchema`: the official
 * spec types its read response as a loose all-optional subset, whereas the
 * runtime returns a richer and stricter shape. Every field here is grounded in
 * an exhaustive prod sweep of all 1104 pages on the teamaag tenant, plus 10
 * single-reads to confirm the single endpoint returns the same key set (no
 * single-only fields). The single and list payloads were identical in shape.
 *
 * Required/optional split verified by presence counts over 1104 items. Always
 * present (1104/1104): id, branchId, spaceId, createdAt, updatedAt, isOutdated,
 * contentType, contents, externalId, ownerId, updatedBy, viewCount, readers,
 * admins, owners. Conditional: `publishedAt` (917/1104; absent on
 * unpublished/draft pages) and `openIssueTypes` (867/1104; absent when there
 * are no open issues).
 *
 * Type nuances grounded in prod: `ownerId`, `updatedBy` and `viewCount` are
 * nullable (drafts/system pages return `null`); `externalId` was `null` on
 * every page in this tenant but the spec types it as `string`, so it is modeled
 * as `string | null`. `contents` is a locale-keyed map (`en_US`, `de_DE`,
 * `ja_JP` observed), not the single hardcoded `en_US` key of the spec.
 *
 * Drift from the spec's `PageResponseSchema`: the spec omits `contentType`,
 * `updatedBy`, `viewCount`, `openIssueTypes` and the `owners` object, declares
 * every field optional, and models `contents` with a single fixed `en_US` key.
 * This curated type corrects all of those against the live runtime.
 */
export interface Page {
  id: string
  branchId: string
  spaceId: string
  createdAt: string
  updatedAt: string
  isOutdated: boolean
  publishedAt?: string
  contentType: string
  contents: Record<string, PageContent>
  externalId: string | null
  ownerId: string | null
  updatedBy: string | null
  viewCount: number | null
  openIssueTypes?: string[]
  readers: PageAccess
  admins: PageAccess
  owners: PageAccess
}
