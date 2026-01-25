<template>
  <div class="w-full">
    <header-banner
      title="portafolio"
      subtitle="Descubre nuestros proyectos y el trabajo que hemos realizado"
    />

    <!-- Coming Soon Section -->
    <section class="coming-soon-section">
      <div class="coming-soon-content">
        <!-- Animated Icon -->
        <div class="icon-container">
          <svg
            class="construction-icon"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
            />
          </svg>
        </div>

        <h2 class="coming-soon-title">Proximamente</h2>
        <p class="coming-soon-text">
          Estamos preparando algo increíble para mostrarte. Nuestro portafolio
          estará disponible muy pronto con todos nuestros proyectos destacados.
        </p>

        <router-link to="/contact" class="cta-button">
          Contáctanos
        </router-link>
      </div>
    </section>

    <!-- Placeholder Cards -->
    <section class="placeholder-section">
      <h3 class="placeholder-title">Proyectos en preparación</h3>
      <div class="placeholder-grid">
        <div
          v-for="n in 3"
          :key="n"
          class="placeholder-card"
          :style="{ animationDelay: `${n * 150}ms` }"
        >
          <div class="placeholder-image"></div>
          <div class="placeholder-content">
            <div class="placeholder-line w-3/4"></div>
            <div class="placeholder-line w-1/2"></div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script lang="ts" setup>
import HeaderBanner from '../components/HeaderBanner.vue'
</script>

<style scoped>
.coming-soon-section {
  @apply py-16 md:py-24 px-4;
}

.coming-soon-content {
  @apply max-w-2xl mx-auto text-center;
}

.icon-container {
  @apply w-24 h-24 md:w-32 md:h-32 mx-auto mb-8;
  @apply rounded-full shadow-3xl flex items-center justify-center;
  @apply bg-snowGray;
}

.construction-icon {
  @apply w-12 h-12 md:w-16 md:h-16 text-lightGreen;
  animation: float 3s ease-in-out infinite;
}

.coming-soon-title {
  @apply text-4xl md:text-5xl lg:text-6xl font-bold text-txtcolor mb-6;
  @apply tracking-tight lowercase;
}

.coming-soon-text {
  @apply text-lg md:text-xl text-gray mb-10 max-w-lg mx-auto;
}

.cta-button {
  @apply inline-block px-10 py-3 bg-lightGreen text-white rounded-full;
  @apply text-lg font-medium transition-all duration-300;
  @apply hover:shadow-lg hover:scale-105 hover:bg-lightGreen/90;
}

.placeholder-section {
  @apply py-16 px-4 bg-snowGray;
}

.placeholder-title {
  @apply text-2xl md:text-3xl text-center text-gray mb-12 lowercase;
}

.placeholder-grid {
  @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto;
}

.placeholder-card {
  @apply rounded-2xl shadow-3xl overflow-hidden;
  @apply opacity-0;
  animation: fadeInUp 0.5s ease-out forwards;
}

.placeholder-image {
  @apply h-48 bg-gradient-to-br from-gray/10 to-gray/20;
  @apply animate-pulse;
}

.placeholder-content {
  @apply p-6 space-y-3;
}

.placeholder-line {
  @apply h-4 bg-gray/20 rounded animate-pulse;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes fadeInUp {
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
