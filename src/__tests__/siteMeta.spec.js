import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { pageRoutes } from '../../build/pageRoutes.js'
import {
  site,
  routeMeta,
  notFoundMeta,
  notFoundPath,
  metaFor,
  headTagsFor,
  renderHeadTags,
  renderSitemap,
  withRouteMeta,
} from '../siteMeta.js'

const read = (path) => readFileSync(resolve(process.cwd(), path), 'utf8')

const contentOf = (tags, attribute, key) =>
  tags.find((tag) => tag.attrs && tag.attrs[attribute] === key)?.attrs.content

describe('the per-route metadata table', () => {
  it('covers exactly the routes the build emits shells for', () => {
    expect(Object.keys(routeMeta).sort()).toEqual(pageRoutes())
  })

  it('gives every route its own title and its own description', () => {
    const titles = Object.values(routeMeta).map((meta) => meta.title)
    const descriptions = Object.values(routeMeta).map((meta) => meta.description)
    expect(new Set(titles).size).toBe(titles.length)
    expect(new Set(descriptions).size).toBe(descriptions.length)
  })

  it('keeps titles and descriptions inside the lengths search results truncate at', () => {
    for (const [path, meta] of Object.entries(routeMeta)) {
      expect(meta.title.length, `title for ${path}`).toBeLessThanOrEqual(60)
      expect(meta.description.length, `description for ${path}`).toBeGreaterThanOrEqual(70)
      expect(meta.description.length, `description for ${path}`).toBeLessThanOrEqual(160)
    }
  })
})

describe('resolving a path to its metadata', () => {
  it('returns an absolute canonical for a known route', () => {
    expect(metaFor('/about').canonical).toBe('https://goargus.dev/about')
    expect(metaFor('/').canonical).toBe('https://goargus.dev/')
  })

  it('ignores a trailing slash, a query string and a fragment', () => {
    for (const path of ['/about/', '/about?utm_source=x', '/about#equipo']) {
      expect(metaFor(path).title).toBe(routeMeta['/about'].title)
    }
  })

  it('falls back to the not-found metadata for any unknown path', () => {
    for (const path of [notFoundPath, '/nope', '/a/b/c']) {
      expect(metaFor(path).title).toBe(notFoundMeta.title)
      expect(metaFor(path).robots).toBe('noindex')
      expect(metaFor(path).canonical).toBeNull()
    }
  })

  it('never marks a real route noindex', () => {
    for (const path of Object.keys(routeMeta)) {
      expect(metaFor(path).robots).toBeUndefined()
    }
  })
})

describe('the head tags rendered into each shell', () => {
  it('carries the route title through to Open Graph and Twitter', () => {
    const tags = headTagsFor('/contact')
    const expected = routeMeta['/contact'].title
    expect(tags[0]).toEqual({ tag: 'title', text: expected })
    expect(contentOf(tags, 'property', 'og:title')).toBe(expected)
    expect(contentOf(tags, 'name', 'twitter:title')).toBe(expected)
  })

  it('points every card at an absolute image URL, which the scrapers require', () => {
    const tags = headTagsFor('/')
    expect(contentOf(tags, 'property', 'og:image')).toBe('https://goargus.dev/og-card.png')
    expect(contentOf(tags, 'name', 'twitter:image')).toBe('https://goargus.dev/og-card.png')
    expect(contentOf(tags, 'name', 'twitter:card')).toBe('summary_large_image')
  })

  it('declares the image dimensions so the card renders before the file is fetched', () => {
    const tags = headTagsFor('/')
    expect(contentOf(tags, 'property', 'og:image:width')).toBe('1200')
    expect(contentOf(tags, 'property', 'og:image:height')).toBe('630')
  })

  it('emits a canonical link for a real route and none for the not-found shell', () => {
    const real = headTagsFor('/portfolio').filter((tag) => tag.tag === 'link')
    expect(real).toHaveLength(1)
    expect(real[0].attrs.href).toBe('https://goargus.dev/portfolio')
    expect(headTagsFor(notFoundPath).filter((tag) => tag.tag === 'link')).toHaveLength(0)
  })

  it('escapes the markup characters a description could contain', () => {
    const rendered = renderHeadTags('/contact')
    expect(rendered).not.toMatch(/content="[^"]*"[^/>]*"/)
    expect(rendered).toContain('<title>')
    expect(rendered.split('\n').every((line) => line.startsWith('    '))).toBe(true)
  })
})

describe('injecting the metadata into a shell', () => {
  const shell = read('index.html')

  it('finds the marker in the committed index.html', () => {
    expect(shell).toContain('<!-- route-meta -->')
    expect(shell).toContain('<!-- /route-meta -->')
  })

  it('replaces the block and leaves the marker in place for the next route', () => {
    const home = withRouteMeta(shell, '/')
    expect(home).toContain(`<title>${routeMeta['/'].title}</title>`)
    expect(home).not.toContain('<title>ARGUS</title>')
    const contact = withRouteMeta(home, '/contact')
    expect(contact).toContain(`<title>${routeMeta['/contact'].title}</title>`)
    expect(contact).not.toContain(routeMeta['/'].title)
  })

  it('declares Spanish and drops the Vite placeholder favicon', () => {
    expect(shell).toContain('<html lang="es">')
    expect(shell).not.toContain('vite.svg')
    expect(shell).toContain('href="/favicon.ico"')
    expect(shell).toContain('href="/apple-touch-icon.png"')
  })
})

describe('the sitemap', () => {
  const xml = renderSitemap(pageRoutes())

  it('lists every route the router serves, as an absolute URL', () => {
    for (const path of pageRoutes()) {
      expect(xml).toContain(`<loc>https://goargus.dev${path === '/' ? '/' : path}</loc>`)
    }
    expect(xml.match(/<loc>/g)).toHaveLength(pageRoutes().length)
  })

  it('is well formed enough for a crawler to parse', () => {
    expect(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(true)
    expect(xml).toContain('xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"')
    expect(xml.trimEnd().endsWith('</urlset>')).toBe(true)
  })
})

describe('robots.txt', () => {
  const robots = read('public/robots.txt')

  it('is committed rather than left to whatever the edge injects', () => {
    expect(robots).toContain('User-agent: *')
    expect(robots).toContain('Allow: /')
  })

  it('points crawlers at the sitemap by absolute URL', () => {
    expect(robots).toContain(`Sitemap: ${site.url}/sitemap.xml`)
  })
})
