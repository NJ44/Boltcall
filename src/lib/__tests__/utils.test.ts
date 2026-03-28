import { describe, it, expect } from 'vitest'
import { cn, formatNumber, scrollToElement } from '../utils'

describe('cn', () => {
  it('merges class names', () => {
    expect(cn('foo', 'bar')).toBe('foo bar')
  })

  it('handles conditional classes', () => {
    expect(cn('base', false && 'hidden', 'visible')).toBe('base visible')
  })

  it('deduplicates tailwind classes', () => {
    expect(cn('px-2 py-1', 'px-4')).toBe('py-1 px-4')
  })

  it('returns empty string with no arguments', () => {
    expect(cn()).toBe('')
  })

  it('handles undefined and null inputs', () => {
    expect(cn('base', undefined, null)).toBe('base')
  })
})

describe('formatNumber', () => {
  it('formats millions with M suffix', () => {
    expect(formatNumber(1000000)).toBe('1.0M')
    expect(formatNumber(2500000)).toBe('2.5M')
  })

  it('formats thousands with K suffix', () => {
    expect(formatNumber(1000)).toBe('1.0K')
    expect(formatNumber(5500)).toBe('5.5K')
    expect(formatNumber(999999)).toBe('1000.0K')
  })

  it('returns plain string for numbers under 1000', () => {
    expect(formatNumber(0)).toBe('0')
    expect(formatNumber(42)).toBe('42')
    expect(formatNumber(999)).toBe('999')
  })
})

describe('scrollToElement', () => {
  it('calls scrollIntoView when element exists', () => {
    const el = document.createElement('div')
    el.id = 'target'
    document.body.appendChild(el)

    scrollToElement('target')
    expect(el.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' })

    document.body.removeChild(el)
  })

  it('does nothing when element does not exist', () => {
    // Should not throw
    scrollToElement('nonexistent')
  })
})
