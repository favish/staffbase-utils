import { isModifiedNativeEvent } from './isModifiedNativeEvent'
import { isNativeLinkEvent } from './isNativeLinkEvent'
import { isTouchLinkEvent } from './isTouchLinkEvent'

describe('isModifiedNativeEvent', () => {
  it('is false for a plain left click', () => {
    const e = new MouseEvent('click', { button: 0 })
    expect(isModifiedNativeEvent(e)).toBe(false)
  })

  it('is true for a middle/right click', () => {
    expect(isModifiedNativeEvent(new MouseEvent('click', { button: 1 }))).toBe(
      true,
    )
  })

  it('is true when a modifier key is held', () => {
    expect(
      isModifiedNativeEvent(new MouseEvent('click', { metaKey: true })),
    ).toBe(true)
  })

  it('is true when default is already prevented', () => {
    const e = new MouseEvent('click', { cancelable: true })
    e.preventDefault()
    expect(isModifiedNativeEvent(e)).toBe(true)
  })
})

describe('isNativeLinkEvent', () => {
  it('is true for a real DOM event', () => {
    expect(isNativeLinkEvent(new MouseEvent('click'))).toBe(true)
  })

  it('is false for a React synthetic-like object', () => {
    expect(isNativeLinkEvent({ preventDefault: () => {} })).toBe(false)
  })

  it('is false for undefined', () => {
    expect(isNativeLinkEvent(undefined)).toBe(false)
  })
})

describe('isTouchLinkEvent', () => {
  it('is true for a TouchEvent-like event with changedTouches', () => {
    const e = new Event('touchend') as unknown as TouchEvent
    Object.defineProperty(e, 'changedTouches', { value: [] })
    expect(isTouchLinkEvent(e)).toBe(true)
  })

  it('is false for a MouseEvent', () => {
    expect(isTouchLinkEvent(new MouseEvent('click'))).toBe(false)
  })
})
