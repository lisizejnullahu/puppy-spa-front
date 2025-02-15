import NextAuth, { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import axios from 'axios'
import { jwtDecode } from 'jwt-decode'

declare module 'next-auth' {
  interface User {
    accessToken?: string
    accessTokenExpires?: number
  }

  interface Session {
    user: {
      id: string
      name: string
      email: string
      image?: string
    }
    accessToken?: string
    error?: string
  }

  interface JWT {
    accessToken?: string
    accessTokenExpires?: number
    user?: {
      id: string
      name: string
      email: string
      image?: string
    }
    error?: string
  }
}

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
            {
              username: credentials?.username,
              password: credentials?.password,
            }
          )

          const user = response.data
          if (!user?.token) return null

          const decoded = jwtDecode(user.token) as { exp: number }

          return {
            id: user.id,
            name: user.username,
            email: user.email,
            image: user.profileImage,
            accessToken: user.token,
            accessTokenExpires: decoded.exp * 1000,
          }
        } catch (error) {
          console.error('Login error:', error)
          return null
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (account && user) {
        return {
          ...token,
          accessToken: user.accessToken,
          accessTokenExpires: user.accessTokenExpires ?? 0,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
          },
        }
      }

      if (
        typeof token.accessTokenExpires === 'number' &&
        Date.now() < token.accessTokenExpires
      ) {
        return token
      }

      return { ...token, error: 'RefreshAccessTokenError' }
    },
    async session({ session, token }) {
      session.user = {
        id: token.user?.id || '',
        name: token.user?.name || '',
        email: token.user?.email || '',
        image: token.user?.image || '',
      }
      session.accessToken = token.accessToken
      session.error = token.error
      return session
    },
  },
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
  },
  pages: {
    signIn: '/',
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
