import type { GroupBranch } from './GroupBranch'

/**
 * The `accessors` object on a group's single-read response.
 *
 * Grounded in a live prod sweep (6/6 single reads): every `accessors` carried a
 * single key, `branch`, holding the platform branch entity the group belongs
 * to. Present only on single reads (`GET /api/groups/{id}`), never on the list
 * items. The official groups spec does not document this shape.
 */
export interface GroupAccessors {
  branch: GroupBranch
}
