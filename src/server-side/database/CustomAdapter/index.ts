import { type Adapter, type AdapterAccount, type AdapterSession, type AdapterUser } from 'next-auth/adapters'
import { type ProviderType } from 'next-auth/providers'
import { type DataSource, type DeepPartial } from 'typeorm'

import { tryDate } from '~/helpers/dates'
import { Account } from '~/server-side/useCases/account/account.entity'
import { Session } from '~/server-side/useCases/session/session.entity'
import { User } from '~/server-side/useCases/user/user.entity'
import { VerificationToken } from '~/server-side/useCases/verification-token/verification-token.entity'

export type FactoryDatasource = () => Promise<DataSource>
export type CreateAdapter = (datasource: DataSource, factoryDS: FactoryDatasource) => Adapter

export const CustomAdapter: CreateAdapter = (datasource, factoryDS) => {
  let dsLocal: DataSource = datasource

  const getDS = async () => {
    if (!dsLocal || !dsLocal?.isInitialized) {
      dsLocal = await factoryDS()
      return dsLocal
    }
    return dsLocal
  }

  //
  const userDto = (data: DeepPartial<User> | User | Partial<User>): AdapterUser => {
    if (data) {
      const { id, emailVerified, email, image, name, level } = data
      const result: AdapterUser = {
        id,
        emailVerified: emailVerified ? tryDate(emailVerified as Date) : null,
        email,
        image,
        name,
        // @ts-ignore
        level
      }
      return result
    }
    return null
  }

  const accDto = (data: Partial<Account>): AdapterAccount => {
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
      const ds = await getDS()
      const repo = ds.getRepository(User)

      const userData = { ...user } as AdapterUser

      const email = user?.email as string
      if (email) {
        // deve atualizar usuário caso já exista
        const userExists = await repo.findOne({ where: { email } })
        if (userExists) userData.id = userExists.id
      } else delete userData?.id

      const data = await repo.save(repo.create(userData))
      return userDto(data)
    },

    async getUser(id) {
      const ds = await getDS()
      const repo = ds.getRepository(User)
      const result = await repo.findOne({ where: { id } })
      // console.log('\n getUser \n', result)
      return userDto(result)
    },
    async getUserByEmail(email) {
      const ds = await getDS()
      const repo = ds.getRepository(User)
      const result = await repo.findOne({ where: { email }, relations: { accounts: true } })

      if (!result?.accounts?.length) return null // para enganar o next-auth e forçar criar novo usuário
      const u = result ? userDto(result) : null
      // console.log('\n getUserByEmail \n', u)
      return u
    },
    async getUserByAccount({ providerAccountId, provider }) {
      const ds = await getDS()
      const repo = ds.getRepository(Account)
      const result = await repo.findOne({ where: { providerAccountId, provider }, relations: { user: true } })
      const u = result?.user ? userDto(result?.user) : null
      // console.log('\n getUserByAccount \n', u)
      return u
    },
    async updateUser(user) {
      const ds = await getDS()
      const repo = ds.getRepository(User)
      const saveData = repo.create(user)
      const data = await repo.save(saveData)
      // ds.destroy()
      return userDto(data)
    },
    async deleteUser(userId) {
      const ds = await getDS()
      const repo = ds.getRepository(User)
      await repo.delete(userId)
      // ds.destroy()
    },
    async linkAccount(account): Promise<AdapterAccount> {
      const ds = await getDS()
      const repo = ds.getRepository(Account)
      const saveData = repo.create(account)
      const result = await repo.save(saveData)

      // console.log('\n linkAccount \n', result)
      // ds.destroy()
      return accDto(result)
    },

    async unlinkAccount({ providerAccountId, provider }) {
      const ds = await getDS()
      const repo = ds.getRepository(Account)
      await repo.delete({ provider, providerAccountId })
      // ds.destroy()
    },

    async createSession({ sessionToken, userId, expires }) {
      const ds = await getDS()
      const repo = ds.getRepository(Session)
      const saveData = repo.create({ sessionToken, userId, expires })
      const result = await repo.save(saveData)
      // ds.destroy()
      return result
    },
    async getSessionAndUser(sessionToken) {
      const ds = await getDS()
      const repo = ds.getRepository(Session)
      const { user, ...session } = await repo.findOne({ where: { sessionToken }, relations: { user: true } })
      const result: { session: AdapterSession; user: AdapterUser } = { user: userDto(user), session }
      // ds.destroy()
      return result
    },
    async updateSession({ sessionToken }) {
      const ds = await getDS()
      const repo = ds.getRepository(Session)
      const session = await repo.findOne({ where: { sessionToken } })
      if (session) {
        const saveData = repo.create(session)
        const result = await repo.save({ ...saveData, sessionToken })
        // ds.destroy()
        return result
      }
      // ds.destroy()
      return null
    },
    async deleteSession(sessionToken) {
      const ds = await getDS()
      const repo = ds.getRepository(Session)
      await repo.delete({ sessionToken })
      // ds.destroy()
    },
    async createVerificationToken({ identifier, expires, token }) {
      const ds = await getDS()
      const repo = ds.getRepository(VerificationToken)
      const saveData = repo.create({ identifier, expires, token })
      const result = await repo.save(saveData)
      // ds.destroy()
      return result
    },
    async useVerificationToken({ identifier, token }) {
      const ds = await getDS()
      const repo = ds.getRepository(VerificationToken)
      const result = await repo.findOne({ where: { identifier, token } })
      // ds.destroy()
      return result
    }
  }
}
