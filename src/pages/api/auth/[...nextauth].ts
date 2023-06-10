import { NextApiHandler } from 'next'
import NextAuth, { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import type { DataSource } from 'typeorm'

import { googleSecrets, isDevMode, secret } from '~/server-side/config'
import { prepareConnection } from '~/server-side/database/conn'
import { CustomAdapter } from '~/server-side/database/CustomAdapter'
import { checkCredentials, getUserCredentials } from '~/server-side/useCases/user/user-auth.service'

// const authorizationUrl = 'https://accounts.google.com/o/oauth2/v2/auth?prompt=consent&access_type=offline&response_type=code'
const maxAge = 30 * 24 * 60 * 60 // 30 days

const options: NextAuthOptions = {
  secret,
  session: { strategy: 'jwt', maxAge },
  jwt: { secret, maxAge },
  pages: { signIn: '/login' },
  providers: [
    GoogleProvider({
      clientId: googleSecrets.clientId,
      clientSecret: googleSecrets.clientSecret,
      authorization: { params: { prompt: 'consent', access_type: 'offline', response_type: 'code' } }
    }),
    CredentialsProvider({
      id: 'custom',
      name: 'custom',
      credentials: { email: { type: 'email', label: 'e-mail' }, password: { type: 'password', label: 'senha' } },
      async authorize(credentials, _req) {
        const { email, password } = credentials
        const user = await checkCredentials(email, password)
        return user ? { ...user } : null
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      const u = await getUserCredentials(user?.id || token?.sub)
      token.level = u?.level
      return token
    },
    async signIn({ account }) {
      if (account.provider === 'google') {
        // return profile.email_verified && profile.email.endsWith('@example.com')
        return true
      }
      return true // Do different verification for other providers that don't have `email_verified`
    }
  },
  debug: !!isDevMode
}

const authHandler: NextApiHandler = async (req, res) => {
  const [opt] = await createOAuthOptions()
  return NextAuth(req, res, opt)
}

export default authHandler

export async function createOAuthOptions(): Promise<[NextAuthOptions, DataSource]> {
  const opt = { ...options } as NextAuthOptions
  const ds = await prepareConnection()
  opt.adapter = CustomAdapter(ds, prepareConnection)
  return [opt, ds]
}
