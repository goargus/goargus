<template>
  <div
    ref="cardRef"
    class="offering-card"
    :class="{ 'animate-visible': isVisible }"
    :style="animationStyle"
  >
    <div class="flex justify-center">
      <img :src="imageSrc" :alt="imageAlt" class="object-contain h-20 md:h-24" />
    </div>
    <h3 class="mt-4 md:mt-6 text-xl md:text-2xl font-bold text-center min-h-[50px] md:min-h-[60px] flex items-center justify-center">
      {{ title }}
    </h3>
    <p class="mt-4 md:mt-6 text-base md:text-lg text-center min-h-[70px] md:min-h-[80px] flex place-items-start justify-center">
      {{ description }}
    </p>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps<{
  imageSrc: string
  imageAlt: string
  title: string
  description: string
  animationDelay?: number
}>()

const cardRef = ref<HTMLElement | null>(null)
const isVisible = ref(false)
let observer: IntersectionObserver | null = null

const animationStyle = computed(() => ({
  animationDelay: props.animationDelay ? `${props.animationDelay}ms` : '0ms'
}))

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
@reference "../style.css";
.offering-card {
  @apply flex flex-col justify-between bg-snowGray rounded-2xl shadow-3xl;
  @apply w-full max-w-[350px] px-4 py-6 md:px-5 md:py-9;
  @apply min-h-[320px] md:min-h-[400px];
  @apply transition-all duration-300 ease-out;
  @apply opacity-0 translate-y-5;
}

.offering-card:hover {
  @apply shadow-xl -translate-y-1;
  transform: translateY(-4px) scale(1.02);
}

.offering-card.animate-visible {
  animation: cardFadeIn 0.5s ease-out forwards;
}

@keyframes cardFadeIn {
  from {
    opacity: 0;
    translate: 0 20px;
  }
  to {
    opacity: 1;
    translate: 0 0;
  }
}
</style>
