import type { Attachment } from 'nodemailer/lib/mailer'

import { smtpConfig } from '~/server-side/config'

import { type EmailServiceSender, type SendPayloadDto } from './send.dto'
import { createTransporterSMTP } from './smtp.provider'

export type { SendPayloadDto, Attachment }

export type MailServiceProvider = 'smtp' | 'sendgrid'

export class MailService {
  public sender: EmailServiceSender

  constructor() {
    this.sender = createTransporterSMTP(smtpConfig)
    return this
  }

  async send(payload: SendPayloadDto, attachments?: Attachment[]) {
    const from = payload?.from || smtpConfig?.auth?.user
    if (!from) throw new Error('invalid_mail_from')
    const response = await this.sender({ from, ...payload }, attachments)
    return response
  }
}

// export const mailService = new MailService()

export function createEmailService() {
  return new MailService()
}
