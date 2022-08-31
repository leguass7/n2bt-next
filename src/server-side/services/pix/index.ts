import { ApiPix, IApiPixConfig } from 'brpix-api-node'
import { FindOptionsWhere } from 'typeorm'

import { dev } from '~/config'
// const dev = false
import { prepareConnection } from '~/server-side/database/conn'
import { ConfigValue } from '~/server-side/useCases/config/config.dto'
import { Config } from '~/server-side/useCases/config/config.entity'

export async function createApiPix(arenaId?: number): Promise<ApiPix> {
  const ds = await prepareConnection()
  const repo = ds.getRepository(Config)

  const where: FindOptionsWhere<Config> = { key: dev ? 'CERT_DEV' : 'CERT' }
  if (arenaId) where.arenaId = arenaId

  const data = await repo.findOne({ where })
  const base64 = data.value as string

  if (!base64) throw new Error('CERTIFICATE ERROR')
  const buffer = Buffer.from(base64, 'base64')

  where.key = 'OTHER'
  const configData = await repo.findOne({ where })
  const config = configData.value as ConfigValue
  if (!config) throw new Error('CONFIG OTHER ERROR')

  // const config: OtherConfigValue = JSON.parse(config)
  if (!config?.clientId || !config?.clientSecret) throw new Error('CERTIFICATE CLIENT ID ERROR')
  if (dev && (!config?.dev?.clientId || !config?.dev?.clientSecret)) throw new Error('CERTIFICATE CLIENT ID ERROR')

  const apiPixCredentials: IApiPixConfig = {
    clientId: dev ? config?.dev?.clientId : config?.clientId,
    clientSecret: dev ? config?.dev?.clientSecret : config?.clientSecret,
    dev,
    certificate: { passphrase: '', path: buffer }
  }

  const api = new ApiPix(apiPixCredentials)
  await api.init()

  return api
}
