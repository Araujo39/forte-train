// Simple JWT implementation for Cloudflare Workers
// Uses Web Crypto API (no Node.js dependencies)

export async function sign(payload: any, secret: string): Promise<string> {
  const header = { alg: 'HS256', typ: 'JWT' }
  
  const encodedHeader = base64UrlEncode(JSON.stringify(header))
  const encodedPayload = base64UrlEncode(JSON.stringify({ ...payload, exp: Math.floor(Date.now() / 1000) + 86400 * 7 }))
  
  const signature = await createSignature(`${encodedHeader}.${encodedPayload}`, secret)
  
  return `${encodedHeader}.${encodedPayload}.${signature}`
}

export async function verify(token: string, secret: string): Promise<any> {
  const parts = token.split('.')
  
  if (parts.length !== 3) {
    throw new Error('Invalid token format')
  }
  
  const [encodedHeader, encodedPayload, signature] = parts
  
  const expectedSignature = await createSignature(`${encodedHeader}.${encodedPayload}`, secret)
  
  if (signature !== expectedSignature) {
    throw new Error('Invalid signature')
  }
  
  const payload = JSON.parse(base64UrlDecode(encodedPayload))
  
  if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
    throw new Error('Token expired')
  }
  
  return payload
}

async function createSignature(data: string, secret: string): Promise<string> {
  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(data))
  return base64UrlEncode(signature)
}

function base64UrlEncode(input: string | ArrayBuffer): string {
  let base64: string
  
  if (typeof input === 'string') {
    base64 = btoa(input)
  } else {
    const bytes = new Uint8Array(input)
    let binary = ''
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i])
    }
    base64 = btoa(binary)
  }
  
  return base64.replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
}

function base64UrlDecode(input: string): string {
  let base64 = input.replace(/-/g, '+').replace(/_/g, '/')
  
  while (base64.length % 4) {
    base64 += '='
  }
  
  return atob(base64)
}
