import NextAuth from 'next-auth'

declare module 'next-auth' {
  interface User {
    id: string
    name: string
    email: string
    image?: string
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
