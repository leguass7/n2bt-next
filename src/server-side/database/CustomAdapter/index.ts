import { Account as AuthAccount } from 'next-auth'
import { Adapter, AdapterSession, AdapterUser } from 'next-auth/adapters'
import { ProviderType } from 'next-auth/providers'

import { Account } from '~/server-side/useCases/account/account.entity'
import { Session } from '~/server-side/useCases/session/session.entity'
import { User } from '~/server-side/useCases/user/user.entity'
import { VerificationToken } from '~/server-side/useCases/verification-token/verification-token.entity'

import { DataSourceService } from '../DataSourceService'

export type FactoryDatasource = () => Promise<DataSourceService>
export type CreateAdapter = (datasource: DataSourceService, factoryDS: FactoryDatasource) => Adapter

export const CustomAdapter: CreateAdapter = (datasource, factoryDS) => {
  let dsLocal: DataSourceService = datasource

  const getDS = async () => {
    if (!dsLocal || !dsLocal?.isInitialized) {
      dsLocal = await factoryDS()
      return dsLocal
    }
    return dsLocal
  }
  //
  const userDto = (data: Partial<User>): AdapterUser => {
    if (data) {
      const { id, emailVerified, email, image, name } = data
      return { id, emailVerified, email, image, name }
    }
    return null
  }

  const accDto = (data: Partial<Account>): AuthAccount => {
    if (data) {
      const {
        access_token,
        expires_at,
        id,
        id_token,
        oauth_token,
        oauth_token_secret,
        provider,
        providerAccountId,
        refresh_token,
        scope,
        session_state,
        token_type,
        type,
        userId
      } = data
      return {
        access_token,
        expires_at,
        id,
        id_token,
        oauth_token,
        oauth_token_secret,
        provider,
        providerAccountId,
        refresh_token,
        scope,
        session_state,
        token_type,
        type: type as ProviderType,
        userId
      }
    }
    return null
  }

  return {
    async createUser(user) {
      console.log('CustomAdapter createUser')
      const ds = await getDS()
      const repo = ds.getRepository(User)
      const saveData = repo.create(user)
      const data = await repo.save(saveData)
      return userDto(data)
    },
    async getUser(id) {
      console.log('CustomAdapter getUser')
      const ds = await getDS()
      const repo = ds.getRepository(User)
      const result = await repo.findOne({ where: { id } })
      return userDto(result)
    },
    async getUserByEmail(email) {
      console.log('CustomAdapter getUserByEmail')
      const ds = await getDS()
      const repo = ds.getRepository(User)
      const result = await repo.findOne({ where: { email } })
      return userDto(result)
    },
    async getUserByAccount({ providerAccountId, provider }) {
      console.log('CustomAdapter getUserByAccount')
      const ds = await getDS()
      const repo = ds.getRepository(Account)
      const result = await repo.findOne({ where: { providerAccountId, provider }, relations: { user: true } })
      return userDto(result?.user)
    },
    async updateUser(user) {
      console.log('CustomAdapter updateUser')
      const ds = await getDS()
      const repo = ds.getRepository(User)
      const saveData = repo.create(user)
      const data = await repo.save(saveData)
      return userDto(data)
    },
    async deleteUser(userId) {
      console.log('CustomAdapter deleteUser')
      const ds = await getDS()
      const repo = ds.getRepository(User)
      await repo.delete(userId)
    },
    async linkAccount(account) {
      console.log('CustomAdapter linkAccount')
      const ds = await getDS()
      const repo = ds.getRepository(Account)
      const saveData = repo.create(account)
      const result = await repo.save(saveData)
      return accDto(result)
    },
    async unlinkAccount({ providerAccountId, provider }) {
      console.log('CustomAdapter unlinkAccount')
      const ds = await getDS()
      const repo = ds.getRepository(Account)
      await repo.delete({ provider, providerAccountId })
    },
    async createSession({ sessionToken, userId, expires }) {
      console.log('CustomAdapter createSession')
      const ds = await getDS()
      const repo = ds.getRepository(Session)
      const saveData = repo.create({ sessionToken, userId, expires })
      const result = await repo.save(saveData)
      return result
    },
    async getSessionAndUser(sessionToken) {
      console.log('CustomAdapter getSessionAndUser')
      const ds = await getDS()
      const repo = ds.getRepository(Session)
      const { user, ...session } = await repo.findOne({ where: { sessionToken }, relations: { user: true } })
      const result: { session: AdapterSession; user: AdapterUser } = { user: userDto(user), session }
      return result
    },
    async updateSession({ sessionToken }) {
      console.log('CustomAdapter updateSession')
      const ds = await getDS()
      const repo = ds.getRepository(Session)
      const session = await repo.findOne({ where: { sessionToken } })
      if (session) {
        const saveData = repo.create(session)
        const result = await repo.save({ ...saveData, sessionToken })
        return result
      }
      return null
    },
    async deleteSession(sessionToken) {
      console.log('CustomAdapter deleteSession')
      const ds = await getDS()
      const repo = ds.getRepository(Session)
      await repo.delete({ sessionToken })
    },
    async createVerificationToken({ identifier, expires, token }) {
      console.log('CustomAdapter createVerificationToken')
      const ds = await getDS()
      const repo = ds.getRepository(VerificationToken)
      const saveData = repo.create({ identifier, expires, token })
      const result = await repo.save(saveData)
      return result
    },
    async useVerificationToken({ identifier, token }) {
      console.log('CustomAdapter useVerificationToken')
      const ds = await getDS()
      const repo = ds.getRepository(VerificationToken)
      const result = await repo.findOne({ where: { identifier, token } })
      return result
    }
  }
}
