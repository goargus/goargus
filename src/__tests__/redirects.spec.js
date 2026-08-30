import { describe, it, expect } from 'vitest'
import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import routes from 'pages-generated'
import { pageRoutes } from '../../build/pageRoutes.js'

const routerPaths = routes
  .map((route) => route.path)
  .filter((path) => !path.includes(':'))
  .sort()

describe('the static route shells emitted at build time', () => {
  it('cover exactly the paths the router defines, no more and no fewer', () => {
    expect(pageRoutes()).toEqual(routerPaths)
  })

  it('excludes the catch-all page, which must not become a static file', () => {
    expect(pageRoutes().some((path) => path.includes('all'))).toBe(false)
  })

  it('leaves no _redirects file, whose rewrites 308 every deep link to the homepage', () => {
    expect(existsSync(resolve(process.cwd(), 'public/_redirects'))).toBe(false)
  })
})
