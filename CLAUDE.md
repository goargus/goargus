# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

See `/mnt/shared/development/CLAUDE.md` for global development guidelines.

## Project Overview

Argus landing page - a Vue 3 + Vite single-page application with Tailwind CSS styling, deployed to Cloudflare Pages. The contact form posts to a Pages Function that sends through Resend.

## Development Commands

```bash
npm run dev       # Start dev server (with --host for network access)
npm run build     # Production build
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

**Contact Form**: `src/components/ContactForm.vue` posts JSON to `/api/contact`, a Cloudflare Pages Function in `functions/api/contact.js` that validates the fields server-side and sends through the Resend API. The sending credential never reaches the browser.

## Environment Variables

The client bundle needs none. The contact Function reads three variables from the Cloudflare Pages project, `RESEND_API_KEY` (encrypted secret), `CONTACT_TO` (the inbox that receives the leads) and the optional `CONTACT_FROM` (defaults to the Resend onboarding sender).

To exercise the Function locally, run `npx wrangler pages dev dist --binding CONTACT_TO=you@example.com --binding RESEND_API_KEY=re_...` after a build.

## Build Configuration

Production builds include:
- Console/debugger statement removal
- Vendor chunk splitting (vue, vue-router)
- Terser minification

## Testing

Tests use Vitest + Vue Test Utils with jsdom environment. Test files are in `src/__tests__/`.

## Deployment

Automatic deployment to Cloudflare Pages via `.github/workflows/deploy.yml` on push to main, and a preview deployment on every pull request. The workflow lints, tests and builds before deploying.

## Notes

- UI text is in Spanish (hardcoded, no i18n framework)
- Tailwind config has custom neumorphic shadow design tokens
- TypeScript strict mode is enabled
