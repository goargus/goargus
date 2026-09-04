<template>
  <section class="quote-banner">
    <div class="quote-content">
      <h2 class="quote-title">
        Y TÚ, ¿YA TIENES WEBSITE?
      </h2>
    </div>

    <div class="quote-image-container">
      <img
        :src="websiteDesign3"
        alt="Website Preview"
        class="quote-image"
      />
      <h3 class="quote-subtitle">¡Quiero Mi Website!</h3>
    </div>

    <div class="quote-cta-container">
      <router-link to="/contact" class="quote-button">
        Cotizar
      </router-link>
    </div>
  </section>
</template>

<script lang="ts" setup>
import websiteDesign3 from '../assets/websiteDesign3.png'
</script>

<style scoped>
@reference "../style.css";
.quote-banner {
  @apply relative flex flex-col md:flex-row items-center justify-center;
  @apply w-full py-8 md:py-4 px-4 md:px-8;
  @apply bg-white gap-6 md:gap-4;
}

.quote-content {
  @apply w-full md:w-1/3 text-center md:text-left;
}

.quote-title {
  @apply text-xl sm:text-2xl md:text-3xl font-inter uppercase text-lightGreen;
  @apply max-w-[300px] mx-auto md:mx-0;
}

.quote-image-container {
  @apply relative flex flex-col items-center justify-center;
  @apply w-full md:w-1/3;
}

.quote-image {
  @apply max-w-full h-auto max-h-[150px] md:max-h-[200px] object-contain;
}

.quote-subtitle {
  @apply text-xl md:text-2xl lg:text-3xl font-bold text-txtcolor;
  @apply mt-2 md:mt-4 text-center;
}

.quote-cta-container {
  @apply w-full md:w-1/3 flex justify-center;
}

.quote-button {
  @apply px-10 md:px-16 lg:px-20 py-2 md:py-3;
  @apply bg-lightGreen text-white rounded-full shadow-3xl;
  @apply text-lg md:text-xl border-2 border-transparent;
  @apply transition-all duration-300;
  @apply hover:shadow-lg hover:scale-105;
}
</style>
