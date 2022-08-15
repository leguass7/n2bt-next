import { tryJson } from '~/helpers/object'

import type { ConfigValue } from './config.dto'

export function configOutDto(input: string | ConfigValue) {
  if (typeof input === 'string') {
    try {
      const result = tryJson(input) || {}
      return result
    } catch (error) {
      return null
    }
  }
  return input
}

export function configInDto(input: string | ConfigValue): string {
  if (typeof input === 'object') {
    try {
      const result = JSON.stringify(input) || null
      return result
    } catch (error) {
      return null
    }
  }
  return input
}
