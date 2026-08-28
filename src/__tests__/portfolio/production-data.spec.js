import { describe, it, expect } from 'vitest'
import projectsData from '../../data/projects.json'

// Guards #63. The studio has no real client work yet, so the shipped data
// must stay empty. Fabricated entries are what this test exists to catch.
describe('shipped project data', () => {
  it('contains no projects until real client work exists', () => {
    expect(projectsData.projects).toEqual([])
  })

  it('contains no client names or testimonials', () => {
    const serialised = JSON.stringify(projectsData)
    expect(serialised).not.toMatch(/clientName/)
    expect(serialised).not.toMatch(/testimonial/)
  })
})
