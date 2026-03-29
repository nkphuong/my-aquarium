import { getServerAccessToken } from '@/lib/auth'
import { isMockMode, MOCK_CHAT_RESPONSES } from '@/lib/mock-data'

export async function POST(request: Request) {
  if (isMockMode()) {
    const response = MOCK_CHAT_RESPONSES[Math.floor(Math.random() * MOCK_CHAT_RESPONSES.length)]
    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      start(controller) {
        // Simulate streaming by sending chunks
        const words = response.split(' ')
        let i = 0
        const interval = setInterval(() => {
          if (i < words.length) {
            const chunk = (i === 0 ? '' : ' ') + words[i]
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: chunk })}\n\n`))
            i++
          } else {
            controller.enqueue(encoder.encode('data: [DONE]\n\n'))
            controller.close()
            clearInterval(interval)
          }
        }, 50)
      },
    })
    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    })
  }

  const accessToken = await getServerAccessToken()

  if (!accessToken) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
    })
  }

  const body = await request.json()
  const apiUrl =
    process.env.API_URL || 'http://localhost:3000'

  const response = await fetch(`${apiUrl}/chat/message`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    return new Response(JSON.stringify({ error: 'Chat request failed' }), {
      status: response.status,
    })
  }

  // Pipe the SSE stream from the backend to the client
  return new Response(response.body, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  })
}
