import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { onRequest } from '../../../functions/api/contact.js'

const validPayload = {
  name: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  phone: '+504 9999 9999',
  message: 'Quisiera cotizar un sitio web para mi empresa.',
}

const env = {
  RESEND_API_KEY: 'test-key',
  CONTACT_TO: 'leads@example.com',
}

function context({ method = 'POST', payload = validPayload, json, ...rest } = {}) {
  return {
    request: {
      method,
      json: json ?? (async () => payload),
    },
    env,
    ...rest,
  }
}

async function call(overrides) {
  const response = await onRequest(context(overrides))
  return { response, body: await response.json() }
}

describe('functions/api/contact', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, status: 200, text: async () => '' }))
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.clearAllMocks()
  })

  it('Rejects every method other than POST', async () => {
    for (const method of ['GET', 'PUT', 'DELETE', 'HEAD']) {
      const { response, body } = await call({ method })
      expect(response.status).toBe(405)
      expect(body.error).toBe('method_not_allowed')
    }

    expect(fetch).not.toHaveBeenCalled()
  })

  it('Fails loudly when the sending credential is absent', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

    const response = await onRequest({
      request: { method: 'POST', json: async () => validPayload },
      env: { CONTACT_TO: env.CONTACT_TO },
    })

    expect(response.status).toBe(500)
    expect((await response.json()).error).toBe('not_configured')
    expect(consoleError).toHaveBeenCalledTimes(1)
    expect(fetch).not.toHaveBeenCalled()

    consoleError.mockRestore()
  })

  it('Fails loudly when the destination inbox is absent', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

    const response = await onRequest({
      request: { method: 'POST', json: async () => validPayload },
      env: { RESEND_API_KEY: env.RESEND_API_KEY },
    })

    expect(response.status).toBe(500)
    expect((await response.json()).error).toBe('not_configured')
    expect(fetch).not.toHaveBeenCalled()

    consoleError.mockRestore()
  })

  it('Rejects a body that is not JSON', async () => {
    const { response, body } = await call({
      json: async () => {
        throw new SyntaxError('Unexpected token')
      },
    })

    expect(response.status).toBe(400)
    expect(body.error).toBe('invalid_json')
    expect(fetch).not.toHaveBeenCalled()
  })

  it('Rejects a JSON body that is not an object', async () => {
    for (const payload of [null, 'a string', 42, ['an', 'array']]) {
      const { response, body } = await call({ payload })
      expect(response.status).toBe(400)
      expect(body.error).toMatch(/invalid_payload|invalid_fields/)
    }

    expect(fetch).not.toHaveBeenCalled()
  })

  it('Names every missing field', async () => {
    const { response, body } = await call({ payload: { name: 'John' } })

    expect(response.status).toBe(400)
    expect(body.error).toBe('invalid_fields')
    expect(body.fields).toEqual(['lastName', 'email', 'phone', 'message'])
    expect(fetch).not.toHaveBeenCalled()
  })

  it('Rejects a field that exceeds its length cap', async () => {
    const cases = [
      ['name', 'a'.repeat(81)],
      ['lastName', 'a'.repeat(81)],
      ['email', `${'a'.repeat(250)}@example.com`],
      ['phone', '1'.repeat(41)],
      ['message', 'a'.repeat(4001)],
    ]

    for (const [field, value] of cases) {
      const { response, body } = await call({ payload: { ...validPayload, [field]: value } })
      expect(response.status).toBe(400)
      expect(body.fields).toEqual([field])
    }

    expect(fetch).not.toHaveBeenCalled()
  })

  it('Rejects a field that fails its format', async () => {
    const cases = [
      ['name', 'John <script>'],
      ['email', 'not-an-email'],
      ['phone', 'call me maybe'],
      ['message', 'four'],
    ]

    for (const [field, value] of cases) {
      const { response, body } = await call({ payload: { ...validPayload, [field]: value } })
      expect(response.status).toBe(400)
      expect(body.fields).toEqual([field])
    }

    expect(fetch).not.toHaveBeenCalled()
  })

  it('Rejects a whitespace-only field', async () => {
    const { response, body } = await call({ payload: { ...validPayload, message: '      ' } })

    expect(response.status).toBe(400)
    expect(body.fields).toEqual(['message'])
  })

  it('Sends the message through Resend with the key server-side', async () => {
    const { response, body } = await call()

    expect(response.status).toBe(200)
    expect(body).toEqual({ ok: true })
    expect(fetch).toHaveBeenCalledTimes(1)

    const [url, options] = fetch.mock.calls[0]
    expect(url).toBe('https://api.resend.com/emails')
    expect(options.method).toBe('POST')
    expect(options.headers.authorization).toBe('Bearer test-key')

    const sent = JSON.parse(options.body)
    expect(sent.to).toEqual(['leads@example.com'])
    expect(sent.reply_to).toBe(validPayload.email)
    expect(sent.subject).toBe('Nuevo mensaje de John Doe')
    expect(sent.text).toContain(validPayload.message)
    expect(sent.html).toContain(validPayload.message)
  })

  it('Trims the values it sends', async () => {
    await call({ payload: { ...validPayload, name: '  John  ', message: '  Hola mundo  ' } })

    const sent = JSON.parse(fetch.mock.calls[0][1].body)
    expect(sent.subject).toBe('Nuevo mensaje de John Doe')
    expect(sent.text).toContain('Hola mundo')
    expect(sent.text).not.toContain('  Hola mundo  ')
  })

  it('Escapes the visitor input in the HTML body', async () => {
    await call({ payload: { ...validPayload, message: '<img src=x onerror="alert(1)"> & "quoted"' } })

    const sent = JSON.parse(fetch.mock.calls[0][1].body)
    expect(sent.html).not.toContain('<img')
    expect(sent.html).toContain('&lt;img')
    expect(sent.html).toContain('&amp;')
    expect(sent.html).toContain('&quot;')
  })

  it('Falls back to the Resend onboarding sender when no from address is set', async () => {
    await call()

    expect(JSON.parse(fetch.mock.calls[0][1].body).from).toBe('ARGUS <onboarding@resend.dev>')
  })

  it('Uses a configured from address when one is set', async () => {
    const response = await onRequest({
      request: { method: 'POST', json: async () => validPayload },
      env: { ...env, CONTACT_FROM: 'ARGUS <hola@goargus.dev>' },
    })

    expect(response.status).toBe(200)
    expect(JSON.parse(fetch.mock.calls[0][1].body).from).toBe('ARGUS <hola@goargus.dev>')
  })

  it('Reports a bad gateway when Resend refuses the message', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    fetch.mockResolvedValue({ ok: false, status: 422, text: async () => 'domain not verified' })

    const { response, body } = await call()

    expect(response.status).toBe(502)
    expect(body.error).toBe('send_failed')
    expect(consoleError).toHaveBeenCalledTimes(1)

    consoleError.mockRestore()
  })

  it('Never leaks the credential to the caller', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    fetch.mockResolvedValue({ ok: false, status: 401, text: async () => 'invalid api key' })

    const response = await onRequest(context())

    expect(await response.text()).not.toContain('test-key')
    expect(response.headers.get('cache-control')).toBe('no-store')

    consoleError.mockRestore()
  })
})
