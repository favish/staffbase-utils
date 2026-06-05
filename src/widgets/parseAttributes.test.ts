import { normalizeLegacyAttributes } from './normalizeLegacyAttributes'
import { parseBooleanAttribute } from './parseBooleanAttribute'
import { parseCommaSeparated } from './parseCommaSeparated'
import { parseEnumAttribute } from './parseEnumAttribute'
import { parseStringAttribute } from './parseStringAttribute'

describe('widget attribute parsing', () => {
  it('parseBooleanAttribute treats only "true" as true', () => {
    expect(parseBooleanAttribute('true', false)).toBe(true)
    expect(parseBooleanAttribute('false', true)).toBe(false)
    expect(parseBooleanAttribute('', true)).toBe(true)
    expect(parseBooleanAttribute(null, false)).toBe(false)
  })

  it('parseEnumAttribute validates against the allowed set', () => {
    const styles = ['default', 'compact'] as const
    expect(parseEnumAttribute('compact', styles, 'default')).toBe('compact')
    expect(parseEnumAttribute('nope', styles, 'default')).toBe('default')
    expect(parseEnumAttribute(undefined, styles, 'default')).toBe('default')
  })

  it('parseStringAttribute falls back when blank', () => {
    expect(parseStringAttribute('hi', 'x')).toBe('hi')
    expect(parseStringAttribute('  ', 'x')).toBe('x')
    expect(parseStringAttribute(null)).toBeUndefined()
  })

  it('parseCommaSeparated trims and drops legacy base64 payloads', () => {
    expect(parseCommaSeparated('a, b ,c')).toEqual(['a', 'b', 'c'])
    expect(parseCommaSeparated('data:text/plain;base64,AAAA')).toBeUndefined()
    expect(parseCommaSeparated('')).toBeUndefined()
  })

  it('normalizeLegacyAttributes backfills kebab from snake_case', () => {
    const el = document.createElement('div')
    el.setAttribute('article_id', '42')
    normalizeLegacyAttributes(el, ['article-id', 'channel-id'])
    expect(el.getAttribute('article-id')).toBe('42')
    expect(el.getAttribute('channel-id')).toBeNull()
  })
})
