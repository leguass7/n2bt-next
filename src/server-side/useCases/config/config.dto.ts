export type ConfigKey = 'CERT_DEV' | 'CERT' | 'PIX' | 'OTHER'
export type ConfigValue = {
  clientId?: string
  clientSecret?: string
  dev: {
    clientId?: string
    clientSecret?: string
  }
}
