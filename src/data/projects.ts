import type { Project, ProjectCategory, LegacyProject } from '../types/project'
import projectsData from './projects.json'

const projects: Project[] = projectsData.projects as Project[]

/**
 * Get all projects sorted by order
 */
export function getAllProjects(): Project[] {
  return [...projects].sort((a, b) => a.order - b.order)
}

/**
 * Get featured projects (for homepage hero section)
 */
export function getFeaturedProjects(): Project[] {
  return projects
    .filter(p => p.featured)
    .sort((a, b) => a.order - b.order)
}

/**
 * Get a single project by its slug
 */
export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find(p => p.slug === slug)
}

/**
 * Get a single project by its ID
 */
export function getProjectById(id: string): Project | undefined {
  return projects.find(p => p.id === id)
}

/**
 * Get projects filtered by category
 */
export function getProjectsByCategory(category: ProjectCategory): Project[] {
  return projects
    .filter(p => p.category === category)
    .sort((a, b) => a.order - b.order)
}

/**
 * Get projects filtered by size
 */
export function getProjectsBySize(size: 'major' | 'simple'): Project[] {
  return projects
    .filter(p => p.size === size)
    .sort((a, b) => a.order - b.order)
}

/**
 * Get all unique categories from existing projects
 */
export function getAvailableCategories(): ProjectCategory[] {
  const categories = new Set(projects.map(p => p.category))
  return Array.from(categories)
}

/**
 * Convert Project to LegacyProject format (for Carousel compatibility)
 */
export function toLegacyProject(project: Project): LegacyProject {
  return {
    imagesrc: project.thumbnail.src,
    imageAlt: project.thumbnail.alt,
    link: project.liveUrl || '#'
  }
}

/**
 * Get featured projects in legacy format for homepage carousel
 */
export function getFeaturedProjectsLegacy(): LegacyProject[] {
  return getFeaturedProjects().map(toLegacyProject)
}

/**
 * Category display names in Spanish
 */
export const categoryLabels: Record<ProjectCategory, string> = {
  'landing-page': 'Landing Page',
  'e-commerce': 'E-commerce',
  'corporate': 'Corporativo',
  'portfolio': 'Portafolio',
  'custom': 'Personalizado'
}

/**
 * Get category label in Spanish
 */
export function getCategoryLabel(category: ProjectCategory): string {
  return categoryLabels[category]
}
