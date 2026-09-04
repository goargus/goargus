export const site = {
  url: 'https://goargus.dev',
  name: 'Go Argus',
  lang: 'es',
  locale: 'es_HN',
  themeColor: '#0A2E2B',
  image: '/og-card.png',
  imageWidth: '1200',
  imageHeight: '630',
  imageAlt: 'Go Argus, diseño y desarrollo web profesional',
}

export const routeMeta = {
  '/': {
    title: 'Go Argus | Diseño y desarrollo web en Honduras',
    description: 'Diseñamos y desarrollamos sitios web profesionales, funcionales y responsivos. Alojamiento, dominios y soporte para tu negocio en Honduras.',
  },
  '/about': {
    title: 'Acerca de nosotros | Go Argus',
    description: 'Unimos estética y funcionalidad. Conoce cómo Go Argus crea soluciones digitales integrales para impulsar la presencia en línea de sus clientes.',
  },
  '/contact': {
    title: 'Contáctanos | Go Argus',
    description: '¿Tienes un proyecto en mente? Escríbenos a hola@goargus.dev o llámanos al +504 9624-3992 y conversemos sobre tu presencia digital.',
  },
  '/portfolio': {
    title: 'Portafolio | Go Argus',
    description: 'Descubre los proyectos que hemos realizado: sitios web a la medida, diseño responsivo y desarrollo pensado para convertir visitas en clientes.',
  },
}

export const notFoundMeta = {
  title: 'Página no encontrada | Go Argus',
  description: 'La página que buscas no existe o fue movida. Vuelve al inicio de Go Argus o escríbenos para que te ayudemos a encontrarla.',
  robots: 'noindex',
}

export const notFoundPath = '/404'

export function metaFor (path) {
  const trimmed = String(path || '/').split('?')[0].split('#')[0]
  const key = trimmed.length > 1 ? trimmed.replace(/\/+$/, '') : '/'
  const match = routeMeta[key]
  if (!match) return { ...notFoundMeta, path: key, canonical: null }
  return { ...match, path: key, canonical: site.url + (key === '/' ? '/' : key) }
}

function escapeHtml (value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export function headTagsFor (path) {
  const meta = metaFor(path)
  const image = site.url + site.image
  const tags = [
    { tag: 'title', text: meta.title },
    { tag: 'meta', attrs: { name: 'description', content: meta.description } },
    { tag: 'meta', attrs: { name: 'theme-color', content: site.themeColor } },
  ]
  if (meta.robots) {
    tags.push({ tag: 'meta', attrs: { name: 'robots', content: meta.robots } })
  }
  if (meta.canonical) {
    tags.push({ tag: 'link', attrs: { rel: 'canonical', href: meta.canonical } })
  }
  tags.push(
    { tag: 'meta', attrs: { property: 'og:type', content: 'website' } },
    { tag: 'meta', attrs: { property: 'og:site_name', content: site.name } },
    { tag: 'meta', attrs: { property: 'og:locale', content: site.locale } },
    { tag: 'meta', attrs: { property: 'og:title', content: meta.title } },
    { tag: 'meta', attrs: { property: 'og:description', content: meta.description } },
    { tag: 'meta', attrs: { property: 'og:url', content: meta.canonical || site.url + '/' } },
    { tag: 'meta', attrs: { property: 'og:image', content: image } },
    { tag: 'meta', attrs: { property: 'og:image:width', content: site.imageWidth } },
    { tag: 'meta', attrs: { property: 'og:image:height', content: site.imageHeight } },
    { tag: 'meta', attrs: { property: 'og:image:alt', content: site.imageAlt } },
    { tag: 'meta', attrs: { name: 'twitter:card', content: 'summary_large_image' } },
    { tag: 'meta', attrs: { name: 'twitter:title', content: meta.title } },
    { tag: 'meta', attrs: { name: 'twitter:description', content: meta.description } },
    { tag: 'meta', attrs: { name: 'twitter:image', content: image } },
  )
  return tags
}

export function renderHeadTags (path, indent = '    ') {
  return headTagsFor(path)
    .map((entry) => {
      if (entry.tag === 'title') return `${indent}<title>${escapeHtml(entry.text)}</title>`
      const attrs = Object.entries(entry.attrs)
        .map(([key, value]) => `${key}="${escapeHtml(value)}"`)
        .join(' ')
      return `${indent}<${entry.tag} ${attrs} />`
    })
    .join('\n')
}

export const metaMarker = /[ \t]*<!-- route-meta -->[\s\S]*?<!-- \/route-meta -->/

export function withRouteMeta (html, path) {
  const block = `    <!-- route-meta -->\n${renderHeadTags(path)}\n    <!-- /route-meta -->`
  return html.replace(metaMarker, block)
}

export function renderSitemap (paths) {
  const urls = paths
    .map((path) => `  <url><loc>${site.url}${path === '/' ? '/' : path}</loc></url>`)
    .join('\n')
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`
}
