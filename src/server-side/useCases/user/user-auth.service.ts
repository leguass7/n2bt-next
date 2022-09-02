import { compareSync } from 'bcrypt'

import { prepareConnection } from '~/server-side/database/conn'

import { User } from './user.entity'

export async function checkCredentials(email = '', password = '') {
  try {
    const db = await prepareConnection()
    const repo = db.getRepository(User)
    const user = await repo.findOneBy({ email: email.toLowerCase().trim() })

    const data = {
      id: user?.id,
      email: user?.email,
      image: user?.image,
      name: user?.name,
      level: user?.level
    }

    return compareSync(password, user?.password) && data
  } catch (err) {
    return null
  }
}

export async function getUserCredentials(id: string) {
  try {
    const db = await prepareConnection()
    const repo = db.getRepository(User)

    const user = await repo
      .createQueryBuilder('User')
      .select(['User.id', 'User.email', 'User.image', 'User.name', 'User.level'])
      .where('User.id = :id', { id })
      .getOne()

    const data = {
      id: user?.id,
      email: user?.email,
      image: user?.image,
      name: user?.name,
      level: user?.level
    }
    return data
  } catch (err) {
    return null
  }
}
