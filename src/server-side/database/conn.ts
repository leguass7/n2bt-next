import 'reflect-metadata'
import { DataSource } from 'typeorm'

import { databaseUrl } from '../config'
import { entities } from './entities'
let connectionReadyPromise: Promise<DataSource> | null = null
let dataSource: DataSource

async function createConnection() {
  const newConn = new DataSource({
    type: 'mysql',
    entities,
    url: databaseUrl,
    extra: { connectionLimit: 6 },
    logging: ['error']
    // logging: ['error', 'query']
  })
  await newConn.initialize()
  return newConn
}

export function prepareConnection() {
  if (!connectionReadyPromise) {
    connectionReadyPromise = (async () => {
      // clean up old connection that references outdated hot-reload classes
      try {
        if (dataSource) {
          await dataSource?.destroy()
          dataSource = null
        }
      } catch (error) {
        // no stale connection to clean up
      }

      // wait for new default connection
      dataSource = await createConnection()
      return dataSource
    })()
  }

  return connectionReadyPromise
}
