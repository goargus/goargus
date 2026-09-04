import { metaFor } from './siteMeta.js'

const managed = [
  ['name', 'description', (meta) => meta.description],
  ['property', 'og:title', (meta) => meta.title],
  ['property', 'og:description', (meta) => meta.description],
  ['property', 'og:url', (meta) => meta.canonical],
  ['name', 'twitter:title', (meta) => meta.title],
  ['name', 'twitter:description', (meta) => meta.description],
]

function upsertMeta (attribute, key, content) {
  const selector = `meta[${attribute}="${key}"]`
  let tag = document.head.querySelector(selector)
  if (content === null || content === undefined) {
    tag?.remove()
    return
  }
  if (!tag) {
    tag = document.createElement('meta')
    tag.setAttribute(attribute, key)
    document.head.appendChild(tag)
  }
  tag.setAttribute('content', content)
}

function upsertCanonical (href) {
  let link = document.head.querySelector('link[rel="canonical"]')
  if (!href) {
    link?.remove()
    return
  }
  if (!link) {
    link = document.createElement('link')
    link.setAttribute('rel', 'canonical')
    document.head.appendChild(link)
  }
  link.setAttribute('href', href)
}

export function applyRouteMeta (path) {
  const meta = metaFor(path)
  document.title = meta.title
  for (const [attribute, key, read] of managed) {
    upsertMeta(attribute, key, read(meta))
  }
  upsertCanonical(meta.canonical)
  return meta
}
