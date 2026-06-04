/**
 * A platform branch entity as embedded in a group's `accessors.branch` on the
 * single-read response.
 *
 * Grounded in a live prod sweep (6 branch entities across 6 single reads): all
 * nine top-level keys below were present on 6/6. The nested `config`, `image`
 * and `colors` objects are platform-controlled branch settings dumps and are
 * typed as opaque records, since their inner shapes are tenant-wide
 * configuration rather than part of the group read contract. The official
 * groups spec does not document this shape.
 */
export interface GroupBranch {
  id: string
  name: string
  slug: string
  tag: string
  config: Record<string, unknown>
  image: Record<string, unknown>
  colors: Record<string, unknown>
  created: string
  updated: string
}
