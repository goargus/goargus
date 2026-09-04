import { describe, it, expect, beforeEach } from 'vitest'
import { applyRouteMeta } from '../documentHead.js'
import { routeMeta, notFoundMeta } from '../siteMeta.js'

const content = (selector) => document.head.querySelector(selector)?.getAttribute('content')

describe('updating the head on client-side navigation', () => {
  beforeEach(() => {
    document.head.querySelectorAll('meta, link[rel="canonical"]').forEach((tag) => tag.remove())
    document.title = ''
  })

  it('sets the title of the route being entered', () => {
    applyRouteMeta('/portfolio')
    expect(document.title).toBe(routeMeta['/portfolio'].title)
  })

  it('creates the description and card tags when the shell has none', () => {
    applyRouteMeta('/about')
    expect(content('meta[name="description"]')).toBe(routeMeta['/about'].description)
    expect(content('meta[property="og:title"]')).toBe(routeMeta['/about'].title)
    expect(content('meta[name="twitter:description"]')).toBe(routeMeta['/about'].description)
  })

  it('rewrites the tags in place instead of appending a second copy', () => {
    applyRouteMeta('/about')
    applyRouteMeta('/contact')
    expect(document.head.querySelectorAll('meta[name="description"]')).toHaveLength(1)
    expect(document.head.querySelectorAll('meta[property="og:title"]')).toHaveLength(1)
    expect(content('meta[name="description"]')).toBe(routeMeta['/contact'].description)
  })

  it('moves the canonical link with the route', () => {
    applyRouteMeta('/about')
    expect(document.head.querySelector('link[rel="canonical"]').href).toBe('https://goargus.dev/about')
    applyRouteMeta('/')
    expect(document.head.querySelectorAll('link[rel="canonical"]')).toHaveLength(1)
    expect(document.head.querySelector('link[rel="canonical"]').href).toBe('https://goargus.dev/')
  })

  it('removes the canonical link on an unknown path so a 404 claims no identity', () => {
    applyRouteMeta('/contact')
    expect(document.head.querySelector('link[rel="canonical"]')).not.toBeNull()
    applyRouteMeta('/nope')
    expect(document.head.querySelector('link[rel="canonical"]')).toBeNull()
    expect(document.title).toBe(notFoundMeta.title)
  })

  it('leaves the robots tag to the catch-all page, which owns it', () => {
    applyRouteMeta('/nope')
    expect(document.head.querySelector('meta[name="robots"]')).toBeNull()
  })
})
