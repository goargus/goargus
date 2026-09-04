<template>
  <footer class="footer-container">
    <img
      loading="lazy"
      src="../assets/defaultLogo.png"
      alt="Go Argus Logo"
      class="footer-logo"
    />

    <nav class="footer-nav">
      <ul class="footer-links">
        <li>
          <router-link to="/contact" class="footer-link">
            Contáctanos
          </router-link>
        </li>
        <li>
          <router-link to="/about" class="footer-link">
            Acerca de Nosotros
          </router-link>
        </li>
      </ul>
    </nav>
  </footer>
</template>

<script lang="ts" setup>
defineProps<{
  title: string
}>()
</script>

<style scoped>
@reference "../style.css";
.footer-container {
  @apply relative flex flex-col md:flex-row justify-between items-center;
  @apply px-6 md:px-12 py-8 md:py-0 min-h-[150px] md:min-h-[193px];
  @apply gap-6 md:gap-10;
  background: linear-gradient(90deg, #072F2E 40%, #090901 100%);
}

.footer-logo {
  @apply object-contain shrink-0 w-48 md:w-[286px] aspect-[1.53];
}

.footer-nav {
  @apply flex flex-col items-center md:items-end gap-4;
}

.footer-links {
  @apply flex flex-col list-none p-0 m-0 text-center md:text-right;
}

.footer-links li {
  @apply my-1;
}

.footer-link {
  @apply text-lightGreen text-lg md:text-2xl no-underline;
  @apply transition-all duration-300;
  @apply hover:opacity-80 hover:translate-x-1;
}
</style>
