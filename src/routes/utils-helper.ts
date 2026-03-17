// Utility functions for ForteTrain

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`
}

export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hash = await crypto.subtle.digest('SHA-256', data)
  
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const passwordHash = await hashPassword(password)
  return passwordHash === hash
}

export function formatDate(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleDateString('pt-BR')
}

export function formatDateTime(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleString('pt-BR')
}

export function calculateDaysSince(timestamp: number): number {
  const now = Date.now()
  const diff = now - (timestamp * 1000)
  return Math.floor(diff / (1000 * 60 * 60 * 24))
}
