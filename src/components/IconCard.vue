<template>
  <div
    ref="cardRef"
    class="icon-card"
    :class="{ 'animate-visible': isVisible }"
  >
    <div class="icon-wrapper">
      <img :src="imageSrc" :alt="imageAlt" class="h-12 w-12 md:h-16 md:w-16" />
    </div>
    <h3 class="mt-8 md:mt-12 text-xl md:text-2xl font-bold text-txtcolor">{{ title }}</h3>
    <p class="mt-4 md:mt-6 text-gray text-base md:text-lg">{{ description }}</p>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue'

defineProps<{
  imageSrc: string
  imageAlt: string
  title: string
  description: string
}>()

const cardRef = ref<HTMLElement | null>(null)
const isVisible = ref(false)
let observer: IntersectionObserver | null = null

onMounted(() => {
  if (!cardRef.value) return

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          isVisible.value = true
          observer?.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.1 }
  )

  observer.observe(cardRef.value)
})

onUnmounted(() => {
  observer?.disconnect()
})
</script>

<style scoped>
.icon-card {
  @apply flex flex-col items-center text-center bg-snowGray rounded-lg;
  @apply p-8 md:p-12 lg:p-16 w-full max-w-[500px];
  @apply opacity-0 translate-y-5;
  @apply transition-all duration-300 ease-out;
}

.icon-card:hover {
  @apply -translate-y-1;
}

.icon-card:hover .icon-wrapper {
  @apply scale-110;
}

.icon-card.animate-visible {
  animation: cardFadeIn 0.5s ease-out forwards;
}

.icon-wrapper {
  @apply flex justify-center items-center rounded-full p-6 md:p-8;
  @apply shadow-3xl border-white border-2;
  @apply transition-transform duration-300;
}

@keyframes cardFadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
