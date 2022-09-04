import { isDefined } from '~/helpers/validation'

import type { IUser } from './user.dto'

export function checkCompleteData(userData: IUser): boolean {
  // const excludeFileds = ['id', 'emailVerified', 'password', 'createdAt', 'updatedAt', 'actived', 'completed', 'category', 'image']
  const includeFields = ['name', 'email', 'password', 'cpf', 'gender', 'phone', 'birday', 'shirtSize']

  const fields = Object.entries(userData).filter(([key, value]) => {
    if (includeFields.includes(key)) {
      return !isDefined(value) || !value
    }
    return false
  })

  return !fields?.length
}
