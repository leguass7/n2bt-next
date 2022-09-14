import { CheckinRawDto } from './checkin.dto'

export const searchFields = ['User_name', 'User_nick', 'User_email', 'Category_title', 'User_phone']

export const convertFields = [
  ['userId', 'Subscription_userId'],
  // ['subscriptionCategoryId', 'Subscription_categoryId'],
  ['actived', 'Subscription_actived'],
  ['verified', 'Subscription_verified'],
  ['categoryId', 'Category_id'],
  ['tournamentId', 'Category_tournamentId'],
  ['title', 'Category_title'],
  ['categoryGender', 'Category_gender'],
  // ['userUserId', 'User_id'],
  ['name', 'User_name'],
  ['nick', 'User_nick'],
  ['email', 'User_email'],
  ['phone', 'User_phone'],
  ['image', 'User_image'],
  ['gender', 'User_gender'],
  ['completed', 'User_completed'],
  ['checkinId', 'Checkin_id'],
  ['checkinUserId', 'Checkin_userId'],
  ['check', 'Checkin_check'],
  ['createdAt', 'Checkin_createdAt']
]

export function checkinRawDto(data: any): CheckinRawDto {
  return Object.entries(data).reduce((acc, [k, v]) => {
    const prop = convertFields.find(f => f.includes(k))?.[0] || null
    if (prop) acc[prop] = v
    return acc
  }, {} as CheckinRawDto)
}
