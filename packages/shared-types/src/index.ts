export type User = {
  id: string
  name: string
  email: string
}

export type ApiResponse<T> = {
  data: T
  success: boolean
  message?: string
}

export function isUser(value: unknown): value is User {
  if (typeof value !== 'object' || value === null) return false
  const v = value as Record<string, unknown>
  return (
    typeof v.id === 'string' &&
    typeof v.name === 'string' &&
    typeof v.email === 'string'
  )
}
