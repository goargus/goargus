<template>
  <div class="filter-container" role="tablist" aria-label="Filtrar proyectos por categoria">
    <button
      class="filter-button"
      :class="{ 'filter-button--active': !activeCategory }"
      role="tab"
      :aria-selected="!activeCategory"
      @click="$emit('update:activeCategory', null)"
    >
      Todos
    </button>
    <button
      v-for="category in categories"
      :key="category"
      class="filter-button"
      :class="{ 'filter-button--active': activeCategory === category }"
      role="tab"
      :aria-selected="activeCategory === category"
      @click="$emit('update:activeCategory', category)"
    >
      {{ getCategoryLabel(category) }}
    </button>
  </div>
</template>

<script lang="ts" setup>
import type { ProjectCategory } from '../../types/project'
import { getCategoryLabel } from '../../data/projects'

defineProps<{
  categories: ProjectCategory[]
  activeCategory: ProjectCategory | null
}>()

defineEmits<{
  'update:activeCategory': [category: ProjectCategory | null]
}>()
</script>

<style scoped>
.filter-container {
  @apply flex flex-wrap gap-2 justify-center;
}

.filter-button {
  @apply px-5 py-2 rounded-full text-sm font-medium;
  @apply transition-all duration-300;
  @apply border-2 border-transparent;
  @apply bg-snowGray text-gray;
  @apply hover:bg-lightGreen/10 hover:text-lightGreen;
  @apply focus:outline-none focus:ring-2 focus:ring-lightGreen focus:ring-offset-2;
}

.filter-button--active {
  @apply bg-lightGreen text-white;
  @apply hover:bg-lightGreen/90 hover:text-white;
}
</style>
