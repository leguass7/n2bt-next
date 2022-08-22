import type { OAuthUserConfig } from 'next-auth/providers'

// import type { ISmtpConfig } from '~/server-side/services/EmailService/smtp.provider'
export const isDevMode = process.env.NODE_ENV !== 'production'
export const secret = process.env.SECRET
export const googleSecrets: OAuthUserConfig<any> = {
  clientId: process.env.GOOGLE_CLIENT_ID || '',
  clientSecret: process.env.GOOGLE_CLIENT_SECRET || ''
}

export const expiracao = 2592000
export const databaseUrl = process.env.DATABASE_URL

// export const smtpConfig: ISmtpConfig = {
//   host: process.env.SMTP_HOST,
//   port: 465,
//   secure: true,
//   auth: {
//     user: process.env.SMTP_USER,
//     pass: process.env.SMTP_PASS
//   }
// }