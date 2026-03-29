import NextAuth, { DefaultSession } from 'next-auth'
import { JWT } from 'next-auth/jwt'

declare module 'next-auth' {
    /**
     * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
     */
    interface Session {
        user: {
            id: number
            fullname?: string
            image?: string
        } & DefaultSession['user']
        accessToken?: string
        refreshToken?: string
        error?: string
    }

    interface User {
        id: string
        fullname?: string
        accessToken?: string
        refreshToken?: string
        expiresIn?: number
    }
}

declare module 'next-auth/jwt' {
    /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
    interface JWT {
        id: string | number
        accessToken?: string
        refreshToken?: string
        expiresIn?: number
        accessTokenExpires?: number
        fullname?: string
        error?: string
    }
}
