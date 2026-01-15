'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function TestRefreshPage() {
  const { data: session, status, update } = useSession()
  const [countdown, setCountdown] = useState<string>('')
  const [testLog, setTestLog] = useState<string[]>([])

  // Calculate time until token expires
  useEffect(() => {
    const interval = setInterval(() => {
      if (session?.accessToken) {
        // Try to decode JWT to get expiry
        try {
          const base64Url = session.accessToken.split('.')[1]
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
          const payload = JSON.parse(window.atob(base64))

          if (payload.exp) {
            const expiresAt = payload.exp * 1000
            const now = Date.now()
            const timeLeft = expiresAt - now

            if (timeLeft > 0) {
              const minutes = Math.floor(timeLeft / 60000)
              const seconds = Math.floor((timeLeft % 60000) / 1000)
              setCountdown(`${minutes}m ${seconds}s`)
            } else {
              setCountdown('EXPIRED')
            }
          }
        } catch (e) {
          setCountdown('Unable to decode token')
        }
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [session])

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString()
    setTestLog(prev => [`[${timestamp}] ${message}`, ...prev.slice(0, 19)])
  }

  const testRefresh = async () => {
    addLog('🔄 Manually triggering session update...')
    try {
      const result = await update()
      if (result?.error === 'RefreshAccessTokenError') {
        addLog('❌ Refresh failed - RefreshAccessTokenError')
      } else {
        addLog('✅ Session updated successfully')
      }
    } catch (error) {
      addLog(`❌ Error: ${error}`)
    }
  }

  const forceExpiry = async () => {
    addLog('⚠️ Forcing token expiry (this is a client-side simulation)')
    addLog('⚠️ Actual expiry check happens server-side in JWT callback')
    addLog('💡 To test real refresh: wait for token to expire or modify expiresIn to 10 seconds')
  }

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Refresh Token Test Page</h1>
        <p className="text-muted-foreground">
          Monitor and test your NextAuth refresh token flow
        </p>
      </div>

      {/* Token Status Card */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Token Status</h2>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-sm text-muted-foreground">Session Status:</span>
              <p className="font-mono font-semibold">{status}</p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Time Until Expiry:</span>
              <p className="font-mono font-semibold text-lg">
                {countdown || 'N/A'}
              </p>
            </div>
          </div>

          <div>
            <span className="text-sm text-muted-foreground">Access Token (first 50 chars):</span>
            <p className="font-mono text-xs bg-muted p-2 rounded break-all">
              {session?.accessToken?.substring(0, 50) || 'No token'}...
            </p>
          </div>

          <div>
            <span className="text-sm text-muted-foreground">Has Refresh Token:</span>
            <p className="font-mono">
              {session?.refreshToken ? '✅ Yes' : '❌ No'}
            </p>
          </div>

          <div>
            <span className="text-sm text-muted-foreground">Error Status:</span>
            <p className="font-mono text-red-500">
              {session?.error || 'None'}
            </p>
          </div>
        </div>
      </Card>

      {/* Test Actions */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Test Actions</h2>
        <div className="space-y-4">
          <div>
            <Button onClick={testRefresh} className="w-full sm:w-auto">
              🔄 Trigger Session Update (Test Refresh)
            </Button>
            <p className="text-xs text-muted-foreground mt-2">
              This calls NextAuth's update() which triggers the JWT callback.
              If token is expired, it will attempt refresh.
            </p>
          </div>

          <div>
            <Button onClick={forceExpiry} variant="destructive" className="w-full sm:w-auto">
              ⚠️ Info: Force Expiry
            </Button>
            <p className="text-xs text-muted-foreground mt-2">
              To test real expiry: modify expiresIn in your backend to 10 seconds, then login and wait.
            </p>
          </div>
        </div>
      </Card>

      {/* Test Log */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Test Log</h2>
        <div className="bg-black text-green-400 p-4 rounded font-mono text-xs h-64 overflow-y-auto">
          {testLog.length === 0 ? (
            <div className="text-gray-500">No logs yet. Click test buttons above.</div>
          ) : (
            testLog.map((log, i) => (
              <div key={i} className="mb-1">
                {log}
              </div>
            ))
          )}
        </div>
      </Card>

      {/* Testing Guide */}
      <Card className="p-6 bg-blue-50 dark:bg-blue-950">
        <h2 className="text-xl font-semibold mb-4">📖 How to Test Refresh Token</h2>
        <ol className="list-decimal list-inside space-y-2 text-sm">
          <li>
            <strong>Option 1 - Wait for natural expiry:</strong>
            <ul className="ml-6 mt-1 list-disc list-inside text-muted-foreground">
              <li>Login with your credentials</li>
              <li>Watch the countdown timer above</li>
              <li>When it hits 0, click "Trigger Session Update"</li>
              <li>Check console/network tab for refresh API call</li>
            </ul>
          </li>
          <li className="mt-3">
            <strong>Option 2 - Test quickly (recommended):</strong>
            <ul className="ml-6 mt-1 list-disc list-inside text-muted-foreground">
              <li>Modify your backend to return `expiresIn: 10` (10 seconds)</li>
              <li>Login again</li>
              <li>Wait 10 seconds</li>
              <li>Click "Trigger Session Update" or navigate to another page</li>
              <li>Check browser console and network tab for refresh</li>
            </ul>
          </li>
          <li className="mt-3">
            <strong>Option 3 - Auto-refresh on navigation:</strong>
            <ul className="ml-6 mt-1 list-disc list-inside text-muted-foreground">
              <li>Wait for token to expire (or use 10 second expiry)</li>
              <li>Navigate to /dashboard or any protected route</li>
              <li>NextAuth JWT callback runs automatically</li>
              <li>Check network tab for POST to /auth/refresh</li>
            </ul>
          </li>
        </ol>
      </Card>
    </div>
  )
}
