import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { load } from 'js-yaml'

const read = (path) => load(readFileSync(resolve(process.cwd(), path), 'utf8'))

const config = read('.github/dependabot.yml')
const updateFor = (ecosystem) => config.updates.find((entry) => entry['package-ecosystem'] === ecosystem)

describe('the dependabot configuration', () => {
  it('parses, which a silent typo in the file would not', () => {
    expect(config.version).toBe(2)
    expect(Array.isArray(config.updates)).toBe(true)
  })

  it('watches the package manifest and the workflow actions', () => {
    expect(config.updates.map((entry) => entry['package-ecosystem']).sort()).toEqual(['github-actions', 'npm'])
    for (const entry of config.updates) {
      expect(entry.directory).toBe('/')
      expect(entry.schedule.interval).toBe('weekly')
    }
  })

  it('groups the npm updates, so a busy week is a few PRs instead of twenty', () => {
    const groups = updateFor('npm').groups
    expect(Object.keys(groups).length).toBeGreaterThan(0)
    for (const group of Object.values(groups)) {
      expect(group.patterns || group['dependency-type']).toBeTruthy()
    }
  })

  it('lets security fixes arrive as one PR of their own', () => {
    const groups = Object.values(updateFor('npm').groups)
    expect(groups.some((group) => group['applies-to'] === 'security-updates')).toBe(true)
  })

  it('leaves major bumps ungrouped, because they need reading', () => {
    const versionGroups = Object.values(updateFor('npm').groups)
      .filter((group) => group['applies-to'] === 'version-updates')
    expect(versionGroups.length).toBeGreaterThan(0)
    for (const group of versionGroups) {
      expect(group['update-types']).toEqual(['minor', 'patch'])
    }
  })
})

describe('the quality gate', () => {
  const gate = read('.github/workflows/quality-gate.yml')
  const steps = gate.jobs.gate.steps.map((step) => step.run).filter(Boolean)

  it('fails the build on a critical advisory in any scope', () => {
    expect(steps).toContain('npm audit --audit-level=critical')
  })

  it('holds what ships to a browser to a stricter line', () => {
    expect(steps).toContain('npm audit --omit=dev --audit-level=high')
  })
})
