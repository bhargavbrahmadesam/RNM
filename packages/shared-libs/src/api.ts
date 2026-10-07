import { env } from '@squeez/shared-config'

console.log('[env] apiBaseUrl =', env.apiBaseUrl)

// Central HTTP client for the app — every backend call goes through here so
// error handling and the base URL live in one place.
//
// `env.apiBaseUrl` includes any version segment the backend uses (e.g.
// `https://api.example.com/api/v1`), so paths passed here are
// version-relative: `apiClient.get('/venues/by-domain/x')`.

export class ApiError extends Error {
  readonly status: number
  readonly code: string

  constructor(status: number, code: string, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
  }
}

interface ApiErrorBody {
  error?: {
    code?: string
    message?: string
  }
}

async function request<T>(
  path: string,
  method: string,
  body?: unknown,
): Promise<T> {
  // FormData bodies must keep their own multipart boundary — setting a
  // Content-Type would break the upload.
  const isFormData = body instanceof FormData

  const response = await fetch(`${env.apiBaseUrl}${path}`, {
    method,
    headers:
      isFormData || body === undefined
        ? {}
        : { 'Content-Type': 'application/json' },
    body:
      body === undefined ? undefined : isFormData ? body : JSON.stringify(body),
  })

  const data: unknown = await response.json().catch(() => null)

  if (!response.ok) {
    const errorBody = data as ApiErrorBody | null
    throw new ApiError(
      response.status,
      errorBody?.error?.code ?? 'UNKNOWN_ERROR',
      errorBody?.error?.message ?? 'Something went wrong. Please try again.',
    )
  }

  return data as T
}

export const apiClient = {
  get: <T>(path: string) => request<T>(path, 'GET'),
  post: <T>(path: string, body?: unknown) => request<T>(path, 'POST', body),
  put: <T>(path: string, body?: unknown) => request<T>(path, 'PUT', body),
  patch: <T>(path: string, body?: unknown) => request<T>(path, 'PATCH', body),
  delete: <T>(path: string) => request<T>(path, 'DELETE'),
  postFormData: <T>(path: string, formData: FormData) =>
    request<T>(path, 'POST', formData),
}


export function getApiErrorMessage(err: unknown): string {
  if (err instanceof ApiError) {
    return err.message
  }
  if (err instanceof Error) {
    return err.message
  }
  return 'Something went wrong. Please try again.'
}