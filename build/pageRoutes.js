import { readdirSync } from 'node:fs'
import { resolve } from 'node:path'

export function pageRoutes(dir = 'src/pages') {
  return readdirSync(resolve(dir))
    .filter((file) => file.endsWith('.vue') && !file.startsWith('['))
    .map((file) => file.slice(0, -'.vue'.length).toLowerCase())
    .map((name) => (name === 'index' ? '/' : `/${name}`))
    .sort()
}
