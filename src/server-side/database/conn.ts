import 'reflect-metadata'
import { DataSource, EntityTarget, ObjectLiteral, Repository } from 'typeorm'
import type { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions'

import { databaseUrl } from '../config'
import { entities } from './entities'

let connectionReadyPromise: Promise<DataSource> | null = null
let dataSource: DataSource

async function createConnection() {
  const optionsConfig: MysqlConnectionOptions = {
    type: 'mysql',
    url: databaseUrl,
    connectTimeout: 5000,
    extra: {
      // acquireTimeout: 5000,
      connectionLimit: 6,
      queueLimit: 5000
      // getConnection: 10
    },
    entities,
    debug: false,
    logging: ['error']
    // logging: ['error', 'query']
  }
  const newConn = new DataSource(optionsConfig)
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

export async function getRepo<Entity extends ObjectLiteral>(target: EntityTarget<Entity>): Promise<Repository<Entity>> {
  const ds = await prepareConnection()
  const repo = ds.getRepository(target)
  return repo
}
