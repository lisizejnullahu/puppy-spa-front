import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import axios from 'axios'

const handler = NextAuth({
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

          if (user) {
            return {
              id: user.id,
              username: user.username,
              profileImage: user.profileImage || '/default-avatar.png',
              accessToken: user.token,
            }
          }
          return null
        } catch (error) {
          console.error('Login error:', error)
          return null
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.username = user.username
        token.profileImage = user.profileImage
        token.accessToken = user.accessToken
      }
      return token
    },
    async session({ session, token }) {
      session.user = {
        id: token.id,
        username: token.username,
        profileImage: token.profileImage,
      }
      session.accessToken = token.accessToken
      return session
    },
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/login',
  },
  debug: true,
})

export { handler as GET, handler as POST }
