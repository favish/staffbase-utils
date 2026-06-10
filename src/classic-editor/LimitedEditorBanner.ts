import { createElement, type CSSProperties, type ReactElement } from 'react'

/**
 * Warning shown above the classic-editor preview. The classic editor only shows
 * a read-only preview for externally-hosted widgets, so this tells editors the
 * surface is limited and how to edit (double-click for the config dialog). Built
 * with createElement (no JSX) to avoid a JSX-runtime build coupling.
 * @returns {ReactElement} The warning banner.
 */
export const LimitedEditorBanner = (): ReactElement => {
  const bannerStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    margin: '0 0 4px',
    padding: '4px 8px',
    background: '#fff7e6',
    border: '1px solid #ffe1a8',
    borderRadius: '3px',
    color: '#8a6d3b',
    font: '600 11px/1.3 Helvetica, Arial, sans-serif',
  }

  return createElement(
    'div',
    { role: 'note', style: bannerStyle },
    createElement('span', { 'aria-hidden': 'true' }, '⚠'),
    createElement(
      'span',
      null,
      'Limited editor — double-click to configure (full preview in Studio / live page)',
    ),
  )
}
