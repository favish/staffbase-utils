/**
 * A single parameter descriptor on a channel HAL link (an entry in a link's
 * `parameters` map or `form` array). Mirrors the Staffbase channels API; the
 * alerts, unacknowledged-bulletins and global-content widgets share this shape.
 */
export interface ChannelLinkParameter {
  type: string
  id: string
  format?: string
  value?: string | number
  required: boolean
}
