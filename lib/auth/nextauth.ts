import NextAuth, { CredentialsSignin } from 'next-auth'
import type { Session, User } from 'next-auth'
import type { JWT } from 'next-auth/jwt'
import Credentials from 'next-auth/providers/credentials'
import { authConfig } from './config'
import { userAccessor } from '@/lib/accessors'
import { AuthError } from '@/lib/errors'
import { isMockMode, MOCK_USER } from '@/lib/mock-data'

/**
 * Custom error class for auth errors with message
 */
class CustomAuthError extends CredentialsSignin {
    constructor(message: string) {
        super(message)
        this.message = message
    }
}

export const { auth, signIn, signOut, handlers } = NextAuth({
    ...authConfig,
    providers: [
        Credentials({
            async authorize(credentials) {
                const { email, password } = credentials as {
                    email: string
                    password: string
                }

                if (isMockMode()) {
                    return {
                        id: String(MOCK_USER.id),
                        name: MOCK_USER.fullname,
                        email: email || MOCK_USER.email,
                        fullname: MOCK_USER.fullname,
                        accessToken: 'mock-access-token',
                        refreshToken: 'mock-refresh-token',
                        expiresIn: 86400,
                    }
                }

                try {
                    const result = await userAccessor.login({ email, password })
                    return {
                        id: String(result.user.id),
                        name: result.user.fullname,
                        email: result.user.email,
                        fullname: result.user.fullname,
                        accessToken: result.accessToken,
                        refreshToken: result.refreshToken,
                        expiresIn: result.expiresIn,
                    }
                } catch (error) {
                    if (error instanceof AuthError) {
                        throw new CustomAuthError(error.message)
                    }

                    if (process.env.NODE_ENV === 'development') {
                        console.error('[NextAuth] Login failed for email:', email)
                    }
                    throw new CustomAuthError('Login failed. Please try again.')
                }
            },
            name: 'credentials',
        }),
        Credentials({
            id: 'registerWithEmail',
            type: 'credentials',
            name: 'registerWithEmail',
            credentials: {
                name: { label: 'Name', type: 'text', placeholder: 'jsmith' },
                email: { label: 'Email', type: 'email', placeholder: 'jsmith' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                const { name, email, password } = credentials as {
                    name?: string
                    email: string
                    password: string
                }

                if (isMockMode()) {
                    return {
                        id: String(MOCK_USER.id),
                        name: name || MOCK_USER.fullname,
                        email: email || MOCK_USER.email,
                        fullname: name || MOCK_USER.fullname,
                        accessToken: 'mock-access-token',
                        refreshToken: 'mock-refresh-token',
                        expiresIn: 86400,
                    }
                }

                try {
                    const result = await userAccessor.register({
                        email,
                        password,
                        fullname: name,
                    })

                    return {
                        id: String(result.user.id),
                        name: result.user.fullname,
                        email: result.user.email,
                        fullname: result.user.fullname,
                        accessToken: result.accessToken,
                        refreshToken: result.refreshToken,
                        expiresIn: result.expiresIn,
                    }
                } catch (error) {
                    if (error instanceof AuthError) {
                        throw new CustomAuthError(error.message)
                    }

                    if (process.env.NODE_ENV === 'development') {
                        console.error('[NextAuth] Registration failed for email:', email)
                    }
                    throw new CustomAuthError('Registration failed. Please try again.')
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }): Promise<JWT> {
            if (user) {
                const typedUser = user as User
                token.accessToken = typedUser.accessToken
                token.refreshToken = typedUser.refreshToken
                token.expiresIn = typedUser.expiresIn

                token.id = typedUser.id
                token.name = typedUser.fullname
                token.email = typedUser.email
                token.fullname = typedUser.fullname
                token.image = typedUser.image

                token.accessTokenExpires = Date.now() + (typedUser.expiresIn || 3600) * 1000
            }

            const typedToken = token as JWT
            if (Date.now() < (typedToken.accessTokenExpires || 0)) {
                return typedToken
            }

            return await refreshAccessToken(typedToken)
        },
        async session({ session, token }): Promise<Session> {
            const typedToken = token as JWT

            return {
                ...session,
                error: typedToken.error,
                user: {
                    id: Number(typedToken.id),
                    name: typedToken.name ?? '',
                    email: typedToken.email ?? '',
                    fullname: typedToken.fullname,
                    image: typedToken.image,
                },
            } as Session
        },
    },
})

async function refreshAccessToken(token: JWT): Promise<JWT> {
    try {
        if (isMockMode()) {
            return {
                ...token,
                accessToken: 'mock-access-token',
                accessTokenExpires: Date.now() + 86400 * 1000,
                error: undefined,
            }
        }

        const result = await userAccessor.refreshToken(token.refreshToken!)

        const newExpiry = Date.now() + (result.expiresIn || 3600) * 1000
        return {
            ...token,
            accessToken: result.accessToken,
            accessTokenExpires: newExpiry,
            refreshToken: result.refreshToken ?? token.refreshToken,
            error: undefined,
        }
    } catch {
        if (process.env.NODE_ENV === 'development') {
            console.error('[NextAuth Refresh] Token refresh failed')
        }
        return {
            ...token,
            error: 'RefreshAccessTokenError',
        }
    }
}

export { authConfig }
