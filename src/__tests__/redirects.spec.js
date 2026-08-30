import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import routes from 'pages-generated'

const routerPaths = routes.map((route) => route.path).filter((path) => !path.includes(':'))

const lines = readFileSync(resolve(process.cwd(), 'public/_redirects'), 'utf-8')
  .trim()
  .split('\n')
  .filter((line) => line.trim() !== '')

describe('public/_redirects', () => {
  it('rewrites exactly the paths the router defines, no more and no fewer', () => {
    const declared = lines.map((line) => line.split(/\s+/)[0])
    expect(declared.slice().sort()).toEqual(routerPaths.slice().sort())
  })

  it('sends every declared path to the SPA shell with a 200', () => {
    for (const line of lines) {
      expect(line).toMatch(/^\S+ \/index\.html 200$/)
    }
  })

  it('declares no catch-all, so unmatched paths reach 404.html with a real 404 status', () => {
    expect(lines.some((line) => line.split(/\s+/)[0].includes('*'))).toBe(false)
  })
})
