# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

See `/mnt/shared/development/CLAUDE.md` for global development guidelines.

## Project Overview

Argus landing page - a Vue 3 + Vite single-page application with Tailwind CSS styling and EmailJS integration for the contact form.

## Development Commands

```bash
npm run dev       # Start dev server (with --host for network access)
npm run build     # Production build (includes obfuscation)
npm run preview   # Preview production build
npm run lint      # Run ESLint
npm run test      # Run Vitest (runs in watch mode by default)
```

To run a single test file:
```bash
npx vitest run src/__tests__/ContactForm.spec.js
```

## Architecture

**Routing**: File-based routing via `vite-plugin-pages`. Routes are auto-generated from `src/pages/`:
- `/` → Index.vue
- `/portfolio` → Portfolio.vue
- `/contact` → Contact.vue
- `/about` → About.vue

**Key entry points**:
- `src/main.js` - Vue app initialization
- `src/App.vue` - Root component with navigation setup

**Contact Form**: Uses EmailJS for client-side email sending. Requires `VITE_EMAILJS_PUBLIC_KEY` environment variable.

## Environment Variables

For local development, create a `.env` file:
```
VITE_EMAILJS_PUBLIC_KEY=your_key_here
```

## Build Configuration

Production builds include:
- Code obfuscation via `vite-plugin-obfuscator`
- Console/debugger statement removal
- Vendor chunk splitting (vue, vue-router)
- Terser minification

## Testing

Tests use Vitest + Vue Test Utils with jsdom environment. Test files are in `src/__tests__/`.

## Deployment

Automatic deployment to GitHub Pages via `.github/workflows/deploy.yml` on push to main. The workflow runs tests before building.

## Notes

- UI text is in Spanish (hardcoded, no i18n framework)
- Tailwind config has custom neumorphic shadow design tokens
- TypeScript strict mode is enabled
