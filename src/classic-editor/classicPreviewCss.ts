/**
 * Extra CSS injected into the classic-editor preview shadow root (on top of the
 * widget's own styles). Makes the preview click-through so double-clicks reach
 * the host element (which opens the config dialog), shows a pointer cursor, and
 * adds a bottom margin so the preview does not collide with following content.
 */
export const classicPreviewCss = `
:host { cursor: pointer; display: block; margin-bottom: 12px; }
:host > * { pointer-events: none; user-select: none; -webkit-user-select: none; }
`
