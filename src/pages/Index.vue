<template>
  <div class="w-full">
    <header-banner
      title="ARGUS"
      :show-scroll-indicator="true"
    />
  </div>

  <div class="flex">
    <div class="flex-grow p-4 md:p-5">
      <div class="p-2 md:p-5">
        <div class="grid grid-cols-1 gap-4">
          <div class="flex py-10 px-4 md:p-20 justify-center items-center">
            <offering-section title="lo que ofrecemos" />
          </div>

          <div class="flex p-4 justify-center items-center">
            <portfolio-of-pages title="nuestros diseños" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import HeaderBanner from '../components/HeaderBanner.vue'
import OfferingSection from '../components/OfferingSection.vue'
import PortfolioOfPages from '../components/PortfolioOfPages.vue'
</script>
