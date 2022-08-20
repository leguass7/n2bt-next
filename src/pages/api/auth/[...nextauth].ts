import { NextApiHandler } from 'next'
import NextAuth, { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'

import { googleSecrets, isDevMode, secret } from '~/server-side/config'
import { prepareDataSource } from '~/server-side/database'
import { CustomAdapter } from '~/server-side/database/CustomAdapter'
import { checkCredentials, getUserCredentials } from '~/server-side/useCases/user/user-auth.service'
// import { entities } from '~/server-side/database/entities'

// const authorizationUrl = 'https://accounts.google.com/o/oauth2/v2/auth?prompt=consent&access_type=offline&response_type=code'
const maxAge = 30 * 24 * 60 * 60 // 30 days
const options: NextAuthOptions = {
  secret,
  session: { strategy: 'jwt', maxAge },
  jwt: {
    secret,
    maxAge
  },
  // adapter: CustomAdapter(, prepareDataSource),
  pages: {
    signIn: '/login',
    newUser: '/register'
  },
  providers: [
    GoogleProvider({
      clientId: googleSecrets.clientId,
      clientSecret: googleSecrets.clientSecret,
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code'
        }
      }
    }),
    CredentialsProvider({
      id: 'custom',
      name: 'custom',
      credentials: {
        email: { type: 'email', label: 'e-mail' },
        password: { type: 'password', label: 'senha' }
      },
      async authorize(credentials, _req) {
        const { email, password } = credentials
        const user = await checkCredentials(email, password)
        return user ? { ...user } : null
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      const u = await getUserCredentials(user?.id)
      token.level = u?.level
      return token
    }
  },
  debug: !!isDevMode
}

const authHandler: NextApiHandler = async (req, res) => {
  const opt = { ...options }
  const ds = await prepareDataSource()
  opt.adapter = CustomAdapter(ds, prepareDataSource)
  return NextAuth(req, res, opt)
}
export default authHandler
