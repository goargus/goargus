<template>
  <header class="relative min-h-[300px] md:min-h-[400px] lg:min-h-[500px] overflow-hidden">
    <img
      src="../assets/Bannerpicture.png"
      alt="Banner"
      class="object-cover w-full h-full absolute inset-0"
    />
    <div class="degraded"></div>

    <div class="absolute inset-0 flex flex-col items-center justify-center px-4">
      <component
        :is="headingTag"
        class="hero-title opacity-0"
        :class="{ 'animate-fade-in-up': mounted }"
      >
        {{ title }}
      </component>

      <p
        v-if="subtitle"
        class="hero-subtitle opacity-0"
        :class="{ 'animate-fade-in-up': mounted }"
        :style="{ animationDelay: '200ms' }"
      >
        {{ subtitle }}
      </p>

      <router-link
        v-if="ctaText && ctaLink"
        :to="ctaLink"
        class="hero-cta opacity-0"
        :class="{ 'animate-fade-in-up': mounted }"
        :style="{ animationDelay: '400ms' }"
      >
        {{ ctaText }}
      </router-link>
    </div>

    <!-- Scroll Indicator -->
    <div
      v-if="showScrollIndicator"
      class="absolute bottom-6 left-1/2 -translate-x-1/2 opacity-0"
      :class="{ 'animate-fade-in': mounted }"
      :style="{ animationDelay: '600ms' }"
    >
      <div class="scroll-indicator">
        <div class="scroll-dot"></div>
      </div>
    </div>
  </header>
</template>

<script lang="ts" setup>
import { computed, ref, onMounted } from 'vue'

const props = withDefaults(defineProps<{
  title: string
  subtitle?: string
  ctaText?: string
  ctaLink?: string
  showScrollIndicator?: boolean
  level?: 1 | 2
}>(), { level: 2 })

const headingTag = computed(() => `h${props.level}`)

const mounted = ref(false)

onMounted(() => {
  mounted.value = true
})
</script>

<style scoped>
@reference "../style.css";
.degraded {
  @apply absolute inset-0;
  background: linear-gradient(90deg, rgba(7, 47, 46, 0.8) 40%, rgba(9, 9, 1, 0.8) 100%);
}

.hero-title {
  @apply text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-lightGreen tracking-tighter leading-none lowercase;
  @apply max-w-full text-center;
}

.hero-subtitle {
  @apply mt-4 md:mt-6 text-lg sm:text-xl md:text-2xl text-white/90 text-center max-w-2xl;
}

.hero-cta {
  @apply mt-6 md:mt-8 px-8 py-3 bg-lightGreen text-white rounded-full;
  @apply text-lg font-medium transition-all duration-300;
  @apply hover:shadow-lg hover:scale-105 hover:bg-lightGreen/90;
}

.scroll-indicator {
  @apply w-6 h-10 border-2 border-white/50 rounded-full flex justify-center pt-2;
}

.scroll-dot {
  @apply w-1 h-2 bg-white/70 rounded-full;
  animation: scrollBounce 2s ease-in-out infinite;
}

@keyframes scrollBounce {
  0%, 100% {
    transform: translateY(0);
    opacity: 1;
  }
  50% {
    transform: translateY(12px);
    opacity: 0.3;
  }
}
</style>
