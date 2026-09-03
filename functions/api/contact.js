const LIMITS = {
  name: 80,
  lastName: 80,
  email: 254,
  phone: 40,
  message: 4000,
}

const NAME_PATTERN = /^[A-Za-zÁÉÍÓÚÜáéíóúüÑñ\s'-]+$/
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_PATTERN = /^[\d\s+()-]+$/

const PATTERNS = {
  name: NAME_PATTERN,
  lastName: NAME_PATTERN,
  email: EMAIL_PATTERN,
  phone: PHONE_PATTERN,
}

const MIN_LENGTHS = {
  name: 1,
  lastName: 1,
  email: 3,
  phone: 5,
  message: 5,
}

function json(body, status) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
    },
  })
}

function validate(payload) {
  const invalid = []
  const clean = {}

  for (const field of Object.keys(LIMITS)) {
    const raw = payload[field]

    if (typeof raw !== "string") {
      invalid.push(field)
      continue
    }

    const value = raw.trim()

    if (value.length < MIN_LENGTHS[field] || value.length > LIMITS[field]) {
      invalid.push(field)
      continue
    }

    const pattern = PATTERNS[field]

    if (pattern && !pattern.test(value)) {
      invalid.push(field)
      continue
    }

    clean[field] = value
  }

  return { invalid, clean }
}

function escapeHtml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

function buildEmail(clean) {
  const fullName = `${clean.name} ${clean.lastName}`

  const text = [
    `Nombre: ${fullName}`,
    `Correo: ${clean.email}`,
    `Teléfono: ${clean.phone}`,
    "",
    clean.message,
  ].join("\n")

  const html = [
    `<p><strong>Nombre:</strong> ${escapeHtml(fullName)}</p>`,
    `<p><strong>Correo:</strong> ${escapeHtml(clean.email)}</p>`,
    `<p><strong>Teléfono:</strong> ${escapeHtml(clean.phone)}</p>`,
    `<p style="white-space:pre-wrap">${escapeHtml(clean.message)}</p>`,
  ].join("")

  return { fullName, text, html }
}

async function handlePost(context) {
  const { env } = context

  if (!env.RESEND_API_KEY) {
    console.error("contact: RESEND_API_KEY is not configured on this deployment")
    return json({ error: "not_configured" }, 500)
  }

  if (!env.CONTACT_TO) {
    console.error("contact: CONTACT_TO is not configured on this deployment")
    return json({ error: "not_configured" }, 500)
  }

  let payload

  try {
    payload = await context.request.json()
  } catch {
    return json({ error: "invalid_json" }, 400)
  }

  if (payload === null || typeof payload !== "object" || Array.isArray(payload)) {
    return json({ error: "invalid_payload" }, 400)
  }

  const { invalid, clean } = validate(payload)

  if (invalid.length > 0) {
    return json({ error: "invalid_fields", fields: invalid }, 400)
  }

  const { fullName, text, html } = buildEmail(clean)

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      authorization: `Bearer ${env.RESEND_API_KEY}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      from: env.CONTACT_FROM || "ARGUS <onboarding@resend.dev>",
      to: [env.CONTACT_TO],
      reply_to: clean.email,
      subject: `Nuevo mensaje de ${fullName}`,
      text,
      html,
    }),
  })

  if (!response.ok) {
    console.error(`contact: resend responded ${response.status} ${await response.text()}`)
    return json({ error: "send_failed" }, 502)
  }

  return json({ ok: true }, 200)
}

export async function onRequest(context) {
  if (context.request.method !== "POST") {
    return json({ error: "method_not_allowed" }, 405)
  }

  return handlePost(context)
}
