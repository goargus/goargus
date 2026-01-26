<template>
  <section class="flex flex-col w-full text-center text-neutral-600 max-md:max-w-full">
    <h2 class="text-6xl tracking-tighter leading-none lowercase max-md:max-w-full max-md:text-4xl">
      {{ title }}
    </h2>

    <Carousel :projects="legacyProjects" />
  </section>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import Carousel from './Carousel.vue'
import { getFeaturedProjects, toLegacyProject } from '../data/projects'
import mockup from '../assets/mockup.png'

defineProps<{
  title: string
}>()

// Get featured projects from real data, falling back to mockup if images aren't available
const legacyProjects = computed(() => {
  const featured = getFeaturedProjects()

  // If we have real projects, convert them to legacy format
  if (featured.length > 0) {
    return featured.map(project => ({
      ...toLegacyProject(project),
      // Use mockup as fallback for placeholder images
      imagesrc: project.thumbnail.src.startsWith('/portfolio/placeholder')
        ? mockup
        : project.thumbnail.src
    }))
  }

  // Fallback to original mock data
  return [
    { imagesrc: mockup, imageAlt: 'Descripcion', link: '#' },
    { imagesrc: mockup, imageAlt: 'Descripcion', link: '#' },
    { imagesrc: mockup, imageAlt: 'Descripcion', link: '#' },
  ]
})
</script>

<style scoped>
img {
  object-fit: contain;
}
</style>
