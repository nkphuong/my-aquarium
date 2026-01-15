# Refresh Token Testing Guide

This guide will help you test the refresh token functionality in your application.

## 🎯 What We're Testing

Your app uses NextAuth.js with JWT-based authentication. When the access token expires (default: 5 minutes), NextAuth automatically attempts to refresh it using the refresh token.

**The Flow:**
1. User logs in → receives `accessToken` + `refreshToken` (expires in 5m)
2. User navigates/makes requests → NextAuth JWT callback checks expiry
3. If expired → calls `refreshAccessToken()` → POST `/auth/refresh`
4. Backend returns new tokens → user stays authenticated

## 📍 Testing URLs

- **Test Page**: http://localhost:3001/test-refresh
- **Dashboard**: http://localhost:3001/dashboard
- **Login**: http://localhost:3001/login

## 🧪 Test Methods

### Method 1: Quick Test (10 Second Expiry) ⭐ RECOMMENDED

This is the fastest way to test the refresh functionality.

**Steps:**

1. **Modify your backend** to return a short expiry time (10 seconds):
   ```typescript
   // In your NestJS backend auth service
   return {
     accessToken: '...',
     refreshToken: '...',
     expiresIn: 10  // ← Change to 10 seconds
   }
   ```

2. **Start your dev server**:
   ```bash
   pnpm dev
   ```

3. **Login** with your test credentials:
   - Email: `test@null3.com`
   - Password: `Abc@12345`

4. **Navigate to test page**:
   - Go to: http://localhost:3001/test-refresh
   - Watch the countdown timer

5. **Wait 10 seconds** until countdown shows "EXPIRED"

6. **Trigger refresh** by either:
   - Click "Trigger Session Update" button
   - Navigate to /dashboard (JWT callback runs automatically)

7. **Check the results**:
   - **Browser Console**: Look for logs:
     ```
     [NextAuth JWT] ⚠️ Token expired! Attempting refresh...
     [NextAuth Refresh] 🔄 Starting token refresh...
     [NextAuth Refresh] ✅ Token refreshed successfully!
     ```
   - **Network Tab**: Look for POST request to `/auth/refresh`
   - **Test Page**: Error status should remain "None" (not "RefreshAccessTokenError")

### Method 2: Wait for Natural Expiry (5 Minutes)

**Steps:**

1. Start dev server and login with credentials
2. Navigate to http://localhost:3001/test-refresh
3. Wait ~5 minutes (watch countdown timer)
4. When countdown reaches 0, click "Trigger Session Update"
5. Check console and network tab for refresh activity

### Method 3: Auto-Refresh on Navigation

**Steps:**

1. Login with your credentials
2. Wait for token to expire (5 min or use 10 sec method)
3. Navigate between pages (e.g., Dashboard → Diagnosis → Tanks)
4. NextAuth JWT callback runs automatically on each navigation
5. Check console for refresh logs

## 🔍 What to Look For

### ✅ Success Indicators

**Browser Console:**
```
[NextAuth JWT] Token still valid - 285s remaining
[NextAuth JWT] Token still valid - 8s remaining
[NextAuth JWT] ⚠️ Token expired! Attempting refresh...
[NextAuth Refresh] 🔄 Starting token refresh...
[NextAuth Refresh] Using refresh token: eyJhbGciOiJIUzI1NiIsI...
[NextAuth Refresh] ✅ Token refreshed successfully!
[NextAuth Refresh] New token expires in: 300 seconds
[NextAuth Refresh] New expiry time: 2026-01-14T10:25:00.000Z
```

**Network Tab:**
- POST request to `http://localhost:3000/auth/refresh`
- Status: 200 OK
- Response body contains new `accessToken` and `refreshToken`

**Test Page:**
- Countdown timer resets to 5:00 (or 0:10 if using quick test)
- Error Status shows "None"
- Access Token changes (first 50 chars will be different)

### ❌ Failure Indicators

**Browser Console:**
```
[NextAuth Refresh] ❌ Error refreshing token: ...
[NextAuth Refresh] ❌ Refresh failed - no access token in response
```

**Test Page:**
- Error Status shows "RefreshAccessTokenError"
- Access Token doesn't change
- Countdown stays at "EXPIRED"

**Network Tab:**
- POST to `/auth/refresh` returns 401 or 500
- No new tokens in response

## 🐛 Troubleshooting

### Issue: "Token still valid" even after expiry

**Cause:** Client-side time calculation doesn't match server-side expiry check.

**Solution:**
- The JWT callback checks `token.accessTokenExpires` (set during login)
- Make sure your backend returns correct `expiresIn` value
- Check server logs to verify JWT callback is running

### Issue: "RefreshAccessTokenError" appears

**Possible causes:**
1. Backend `/auth/refresh` endpoint not working
2. Refresh token is invalid/expired
3. Network error

**Debug steps:**
1. Check Network tab for failed `/auth/refresh` request
2. Check backend logs for errors
3. Verify refresh token is being sent correctly
4. Test `/auth/refresh` endpoint directly with Postman

### Issue: No refresh attempt at all

**Cause:** JWT callback not running.

**Solution:**
- JWT callback only runs on:
  - `useSession()` polling (default: 0 seconds in dev)
  - Navigation between pages
  - Manual `update()` call
- Try navigating to a different page to trigger it

## 📊 Test Page Features

The test page at `/test-refresh` provides:

1. **Token Status Panel**
   - Current session status
   - Countdown to token expiry
   - Token preview
   - Error status

2. **Test Actions**
   - Manual session update trigger
   - Instructions for testing

3. **Live Test Log**
   - Real-time activity logging
   - Timestamp for each action

4. **Testing Guide**
   - Step-by-step instructions
   - Multiple testing approaches

## 🔧 Backend Requirements

Make sure your NestJS backend has:

1. **POST /auth/refresh endpoint** that:
   - Accepts `{ refreshToken: string }`
   - Validates the refresh token
   - Returns new `accessToken`, `refreshToken`, `expiresIn`

2. **Response format**:
   ```json
   {
     "success": true,
     "data": {
       "user": {
         "id": "...",
         "authId": "...",
         "fullname": "..."
       },
       "accessToken": "...",
       "refreshToken": "...",
       "expiresIn": 300
     }
   }
   ```

## 📝 Next Steps

After confirming refresh works:

1. **Restore production expiry time** (5-15 minutes recommended)
2. **Add error handling UI** for refresh failures (e.g., redirect to login)
3. **Consider automatic logout** on RefreshAccessTokenError
4. **Add refresh token rotation** for security (optional)
5. **Monitor refresh failures** in production logs

## 🎉 Success Criteria

Your refresh token implementation is working correctly if:

- ✅ Token expires after configured time
- ✅ Refresh triggers automatically on navigation
- ✅ Console shows successful refresh logs
- ✅ Network shows 200 OK on `/auth/refresh`
- ✅ New tokens are received and stored
- ✅ User stays authenticated without re-login
- ✅ No "RefreshAccessTokenError" appears

---

**Quick Test Command:**
```bash
# 1. Modify backend expiresIn to 10
# 2. Start dev server
pnpm dev

# 3. Open browser and login
# Email: test@null3.com
# Password: Abc@12345

# 4. Navigate to:
# http://localhost:3001/test-refresh

# 5. Wait 10 seconds and click "Trigger Session Update"
# 6. Check console for refresh logs
```
