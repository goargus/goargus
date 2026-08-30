import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

describe('public/_redirects', () => {
  it('rewrites every path to index.html with a 200', () => {
    const contents = readFileSync(
      resolve(process.cwd(), 'public/_redirects'),
      'utf-8',
    )

    expect(contents.trim()).toBe('/* /index.html 200')
  })
})
