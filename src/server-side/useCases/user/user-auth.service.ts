import { compareSync } from 'bcrypt'

import { prepareDataSource } from '~/server-side/database'

import { User } from './user.entity'

export async function checkCredentials(email: string, password: string) {
  try {
    const db = await prepareDataSource()
    const repo = db.getRepository(User)
    const user = await repo.findOneBy({ email })

    const data = {
      id: user?.id,
      email: user?.email,
      image: user?.image,
      name: user?.name,
      level: user?.level
    }

    db?.destroy()
    return compareSync(password, user?.password) && data
  } catch (err) {
    return null
  }
}

export async function getUserCredentials(id: string) {
  try {
    const db = await prepareDataSource()
    const repo = db.getRepository(User)
    const user = await repo.findOneBy({ id })

    const data = {
      id: user?.id,
      email: user?.email,
      image: user?.image,
      name: user?.name,
      level: user?.level
    }

    db?.destroy()
    return data
  } catch (err) {
    return null
  }
}
