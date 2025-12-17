# HTTP Client - Builder Pattern 🚀

A fluent, type-safe HTTP client with builder pattern for easy API calls.

## Quick Start

### Basic Usage

```typescript
import { httpClient } from '@/lib/http'

// Simple GET request
const users = await httpClient
  .get('/users')
  .send<User[]>()

// GET with query parameters
const filteredUsers = await httpClient
  .get('/users')
  .withParams({ role: 'admin', active: true })
  .send<User[]>()

// POST with body
const newUser = await httpClient
  .post('/users')
  .withBody({ email: 'user@example.com', name: 'John' })
  .send<User>()

// With authentication
const profile = await httpClient
  .get('/profile')
  .withAuth()
  .send<UserProfile>()
```

## Builder Methods

### HTTP Methods

```typescript
httpClient.get(url)      // GET request
httpClient.post(url)     // POST request
httpClient.put(url)      // PUT request
httpClient.patch(url)    // PATCH request
httpClient.delete(url)   // DELETE request
```

### Adding Headers

```typescript
// Custom headers
httpClient
  .get('/users')
  .withHeaders({
    'X-Custom-Header': 'value',
    'Accept-Language': 'en-US',
  })
  .send()

// Authorization (Bearer token)
httpClient
  .get('/protected')
  .withAuth('your-token-here')
  .send()

// Auto-reads from localStorage if no token provided
httpClient
  .get('/protected')
  .withAuth()  // Reads from localStorage('auth_token')
  .send()
```

### Query Parameters

```typescript
httpClient
  .get('/search')
  .withParams({
    q: 'typescript',
    page: 1,
    limit: 10,
    sort: 'desc'
  })
  .send()

// URL: /search?q=typescript&page=1&limit=10&sort=desc
```

### Request Body

```typescript
// JSON body (default)
httpClient
  .post('/users')
  .withBody({
    email: 'user@example.com',
    name: 'John Doe',
    age: 30
  })
  .send()

// FormData
const formData = new FormData()
formData.append('file', file)
formData.append('name', 'avatar.png')

httpClient
  .post('/upload')
  .asFormData()
  .withBody(formData)
  .send()
```

### Request Cancellation

```typescript
const abortController = new AbortController()

httpClient
  .get('/slow-endpoint')
  .withSignal(abortController.signal)
  .send()

// Cancel the request
abortController.abort()
```

## Complete Examples

### 1. Login Example

```typescript
async function login(email: string, password: string) {
  try {
    const response = await httpClient
      .post('/auth/login')
      .withBody({ email, password })
      .send<{ token: string; user: User }>()

    // Save token
    localStorage.setItem('auth_token', response.token)

    return response.user
  } catch (error) {
    console.error('Login failed:', error)
    throw error
  }
}
```

### 2. Paginated List

```typescript
async function fetchUsers(page: number, limit: number) {
  return await httpClient
    .get('/users')
    .withAuth()
    .withParams({ page, limit })
    .send<{
      data: User[]
      total: number
      page: number
    }>()
}
```

### 3. File Upload

```typescript
async function uploadAvatar(file: File) {
  const formData = new FormData()
  formData.append('avatar', file)

  return await httpClient
    .post('/users/avatar')
    .withAuth()
    .asFormData()
    .withBody(formData)
    .send<{ url: string }>()
}
```

### 4. Update User

```typescript
async function updateUser(id: string, data: Partial<User>) {
  return await httpClient
    .patch(`/users/${id}`)
    .withAuth()
    .withBody(data)
    .send<User>()
}
```

### 5. Delete with Confirmation

```typescript
async function deleteUser(id: string) {
  return await httpClient
    .delete(`/users/${id}`)
    .withAuth()
    .withHeaders({
      'X-Confirm-Delete': 'true'
    })
    .send<void>()
}
```

## Error Handling

```typescript
try {
  const user = await httpClient
    .get('/users/123')
    .send<User>()

  console.log(user)
} catch (error) {
  if (error instanceof Error) {
    console.error('Error:', error.message)

    // Access status code
    const status = (error as any).status
    if (status === 404) {
      console.error('User not found')
    } else if (status === 401) {
      console.error('Unauthorized')
    }
  }
}
```

## Advanced Features

### Custom Base URL

```typescript
import { createHttpClient } from '@/lib/http'

const customClient = createHttpClient('https://api.example.com')

const data = await customClient
  .get('/endpoint')
  .send()
```

### Raw Response

```typescript
const response = await httpClient
  .get('/users')
  .sendRaw()

// Access headers, status, etc.
console.log(response.status)
console.log(response.headers.get('content-type'))

const data = await response.json()
```

### Chaining Multiple Configurations

```typescript
const result = await httpClient
  .post('/complex-endpoint')
  .withAuth()
  .withHeaders({
    'X-API-Version': 'v2',
    'X-Request-ID': crypto.randomUUID(),
  })
  .withParams({
    include: 'metadata',
    expand: 'relations',
  })
  .withBody({
    name: 'New Item',
    category: 'electronics',
  })
  .send<ComplexResponse>()
```

## Configuration

### Environment Variables

```bash
# .env.local
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

The HTTP client automatically uses this as the base URL.

### Default Headers

The client includes these headers by default:
- `Content-Type: application/json`

You can override or add more using `.withHeaders()`.

## Best Practices

### ✅ DO

- Use `.withAuth()` for protected endpoints
- Handle errors with try-catch
- Use TypeScript generics for type safety: `.send<User>()`
- Use query parameters for filtering/pagination
- Use body for POST/PUT/PATCH data

### ❌ DON'T

- Don't include sensitive data in query params (use body instead)
- Don't forget to add `.send()` at the end
- Don't manually construct URLs with query strings (use `.withParams()`)

## Integration with React Query

See [React Query Hooks](../react-query/README.md) for examples of using this client with React Query.

## TypeScript Support

Fully typed with TypeScript:

```typescript
interface CreateUserDTO {
  email: string
  name: string
  role?: 'admin' | 'user'
}

interface UserResponse {
  id: string
  email: string
  name: string
  createdAt: string
}

// Type-safe request and response
const user = await httpClient
  .post('/users')
  .withBody<CreateUserDTO>({
    email: 'user@example.com',
    name: 'John Doe',
    role: 'admin'  // Autocomplete works!
  })
  .send<UserResponse>()

// user is typed as UserResponse ✅
console.log(user.id, user.email)
```

## Comparison with fetch()

### Before (Raw fetch):
```typescript
const response = await fetch('https://api.example.com/users?page=1&limit=10', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  },
  body: JSON.stringify({ name: 'John' })
})

if (!response.ok) {
  throw new Error(`HTTP error! status: ${response.status}`)
}

const data = await response.json()
```

### After (HTTP Client):
```typescript
const data = await httpClient
  .post('/users')
  .withAuth(token)
  .withParams({ page: 1, limit: 10 })
  .withBody({ name: 'John' })
  .send()
```

Much cleaner! 🎉
