<template>
  <div class="portfolio-grid" :class="gridClass">
    <PortfolioCard
      v-for="project in projects"
      :key="project.id"
      :project="project"
      :featured="project.featured"
      @select="$emit('select', $event)"
    />
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import type { Project } from '../../types/project'
import PortfolioCard from './PortfolioCard.vue'

const props = withDefaults(defineProps<{
  projects: Project[]
  columns?: 2 | 3
}>(), {
  columns: 3
})

defineEmits<{
  select: [project: Project]
}>()

const gridClass = computed(() => ({
  'grid-cols-2': props.columns === 2,
  'grid-cols-3': props.columns === 3
}))
</script>

<style scoped>
.portfolio-grid {
  @apply grid gap-6 grid-cols-1;
}

@media (min-width: 768px) {
  .portfolio-grid {
    gap: 2rem;
  }

  .portfolio-grid.grid-cols-2 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .portfolio-grid.grid-cols-3 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 1024px) {
  .portfolio-grid.grid-cols-3 {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
</style>
