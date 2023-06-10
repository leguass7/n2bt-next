import type { ISmtpConfig } from '../services/EmailService/smtp.provider'

export const isDevMode = process.env.NODE_ENV !== 'production'
export const secret = process.env.SECRET
export const nextAuthUrl = process.env.NEXTAUTH_URL

export const googleSecrets = {
  clientId: process.env.GOOGLE_CLIENT_ID || '',
  clientSecret: process.env.GOOGLE_CLIENT_SECRET || ''
}

export const azureSecrets = {
  clientId: process.env.AZURE_AD_CLIENT_ID,
  clientSecret: process.env.AZURE_AD_CLIENT_SECRET,
  tenantId: process.env.AZURE_AD_TENANT_ID
}

export const expiracao = 2592000
export const databaseUrl = process.env.DATABASE_URL

export const smtpConfig: ISmtpConfig = {
  host: process.env.SMTP_HOST,
  port: +process.env?.SMTP_PORT || 465,
  secure: !!(process.env?.SMTP_SECURE === '1'),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
}
