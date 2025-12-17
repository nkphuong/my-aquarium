/**
 * HTTP Client with Builder Pattern
 *
 * Fluent API for making HTTP requests with ease!
 *
 * Usage:
 * ```typescript
 * const response = await httpClient
 *   .get('/users')
 *   .withAuth()
 *   .withParams({ page: 1, limit: 10 })
 *   .send<User[]>()
 * ```
 */

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

interface RequestConfig {
  method: HttpMethod
  url: string
  headers: Record<string, string>
  params?: Record<string, any>
  body?: any
  signal?: AbortSignal
}

export class HttpClient {
  private config: RequestConfig

  constructor(
    private baseURL: string = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || 'http://localhost:3000'
  ) {
    this.config = {
      method: 'GET',
      url: '',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  }

  /**
   * Start a GET request
   */
  get(url: string): HttpClient {
    this.config.method = 'GET'
    this.config.url = url
    return this
  }

  /**
   * Start a POST request
   */
  post(url: string): HttpClient {
    this.config.method = 'POST'
    this.config.url = url
    return this
  }

  /**
   * Start a PUT request
   */
  put(url: string): HttpClient {
    this.config.method = 'PUT'
    this.config.url = url
    return this
  }

  /**
   * Start a PATCH request
   */
  patch(url: string): HttpClient {
    this.config.method = 'PATCH'
    this.config.url = url
    return this
  }

  /**
   * Start a DELETE request
   */
  delete(url: string): HttpClient {
    this.config.method = 'DELETE'
    this.config.url = url
    return this
  }

  /**
   * Add custom headers
   */
  withHeaders(headers: Record<string, string>): HttpClient {
    this.config.headers = { ...this.config.headers, ...headers }
    return this
  }

  /**
   * Add Authorization header (Bearer token)
   */
  withAuth(token?: string): HttpClient {
    if (token) {
      this.config.headers['Authorization'] = `Bearer ${token}`
    } else if (typeof window !== 'undefined') {
      // Try to get token from localStorage or session
      const storedToken = localStorage.getItem('auth_token')
      if (storedToken) {
        this.config.headers['Authorization'] = `Bearer ${storedToken}`
      }
    }
    return this
  }

  /**
   * Add query parameters
   */
  withParams(params: Record<string, any>): HttpClient {
    this.config.params = { ...this.config.params, ...params }
    return this
  }

  /**
   * Add request body (for POST, PUT, PATCH)
   */
  withBody(body: any): HttpClient {
    this.config.body = body
    return this
  }

  /**
   * Add abort signal for cancellation
   */
  withSignal(signal: AbortSignal): HttpClient {
    this.config.signal = signal
    return this
  }

  /**
   * Set Content-Type to multipart/form-data
   */
  asFormData(): HttpClient {
    this.config.headers['Content-Type'] = 'multipart/form-data'
    return this
  }

  /**
   * Execute the request
   */
  async send<T = any>(): Promise<T> {
    const url = this.buildURL()
    const options: RequestInit = {
      method: this.config.method,
      headers: this.config.headers,
      signal: this.config.signal,
    }

    // Add body for non-GET requests
    if (this.config.body && this.config.method !== 'GET') {
      if (this.config.headers['Content-Type'] === 'application/json') {
        options.body = JSON.stringify(this.config.body)
      } else {
        options.body = this.config.body
      }
    }

    try {
      const response = await fetch(url, options)

      // Handle non-OK responses
      if (!response.ok) {
        const error = await this.handleError(response)
        throw error
      }

      // Parse response
      const contentType = response.headers.get('content-type')
      if (contentType?.includes('application/json')) {
        return await response.json()
      }

      return (await response.text()) as any
    } catch (error) {
      if (error instanceof Error) {
        throw error
      }
      throw new Error('Network request failed')
    }
  }

  /**
   * Execute and get raw Response object
   */
  async sendRaw(): Promise<Response> {
    const url = this.buildURL()
    const options: RequestInit = {
      method: this.config.method,
      headers: this.config.headers,
      signal: this.config.signal,
    }

    if (this.config.body && this.config.method !== 'GET') {
      if (this.config.headers['Content-Type'] === 'application/json') {
        options.body = JSON.stringify(this.config.body)
      } else {
        options.body = this.config.body
      }
    }

    return await fetch(url, options)
  }

  /**
   * Build full URL with query params
   */
  private buildURL(): string {
    let url = this.config.url.startsWith('http')
      ? this.config.url
      : `${this.baseURL}${this.config.url}`

    // Add query parameters
    if (this.config.params) {
      const searchParams = new URLSearchParams()
      Object.entries(this.config.params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value))
        }
      })
      const queryString = searchParams.toString()
      if (queryString) {
        url += `?${queryString}`
      }
    }

    return url
  }

  /**
   * Handle HTTP errors
   */
  private async handleError(response: Response): Promise<Error> {
    let message = `HTTP Error ${response.status}: ${response.statusText}`

    try {
      const contentType = response.headers.get('content-type')
      if (contentType?.includes('application/json')) {
        const errorData = await response.json()
        message = errorData.message || errorData.error || message
      }
    } catch {
      // Ignore JSON parse errors
    }

    const error = new Error(message)
    ;(error as any).status = response.status
    ;(error as any).response = response
    return error
  }
}

/**
 * Default HTTP client instance
 */
export const httpClient = new HttpClient()

/**
 * Create a new HTTP client with custom base URL
 */
export function createHttpClient(baseURL: string): HttpClient {
  return new HttpClient(baseURL)
}
