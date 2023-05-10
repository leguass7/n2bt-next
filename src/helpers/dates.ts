import { format, isValid, parse, parseJSON } from 'date-fns'
import { utcToZonedTime } from 'date-fns-tz'

import { makeArray } from './array'

export function formatInTimeZone(date: Date, fmt = 'yyyy-MM-dd', tz = 'UTC') {
  return format(utcToZonedTime(date, tz), fmt)
}

export const formatDate = (date: string | Date): string => {
  if (date) {
    const transformInDate = typeof date === 'string' ? parseJSON(date) : date
    return format(transformInDate, 'dd/MM/yyyy')
  }
  return '--'
}

export const formatMysqlDate = (date: string | Date): string => {
  if (date) {
    const transformInDate = typeof date === 'string' ? parse(date, 'yyyy-MM-dd', new Date()) : date
    return format(transformInDate, 'dd/MM/yyyy')
  }
  return '--'
}

export const splitDateTime = (date: string | Date) => {
  if (date) {
    const transformInDate = typeof date === 'string' ? parseJSON(date) : date
    return format(transformInDate, 'dd/MM/yyyy HH:mm ')?.split(' ')
  }
  return ['--', '--']
}

// export const tryDate = (date: string | Date): Date => {
//   try {
//     if (typeof date === 'string') {
//       const d = parse(date, 'yyyy-MM-dd', new Date())
//       if (isValid(d)) return d
//     }
//   } catch (error) {
//     return null
//   }
//   return date as Date
// }

type Func = typeof parseJSON
export function tryDate(str: Date | string, formats: string | string[] = []): Date {
  const supportedList = [
    parseJSON,
    ...makeArray(formats).filter(f => !!f),
    'yyyy-MM-dd HH:mm:ss',
    'dd/MM/yyyy HH:mm:ss',
    'yyyy-MM-dd',
    'dd/MM/yyyy',
    'MM/dd/yyyy'
  ]

  const parsing = (supported: string | Func, value: string) => {
    const v = typeof supported === 'function' ? supported(value) : parse(value, supported, new Date())
    return isValid(v) ? v : null
  }

  const trying = (v: string) =>
    supportedList.reduce((acc, supported) => {
      if (!acc) acc = parsing(supported, v)
      return acc
    }, null as Date)
  return typeof str === 'string' ? trying(str) : str
}
