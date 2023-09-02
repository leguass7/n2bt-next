import type { DataSource, FindOptionsWhere } from 'typeorm'

import { User } from './user.entity'

export class UserService {
  constructor(private readonly ds: DataSource) {}

  async findUser(where: FindOptionsWhere<User>) {
    try {
      const repo = this.ds.getRepository(User)
      const user = await repo.findOne({ where })
      return user
    } catch {
      return null
    }
  }
}
