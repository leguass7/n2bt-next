import { format, isValid, parseISO } from 'date-fns'

export function validDate(date?: Date | string) {
  if (date instanceof Date) return date
  if (typeof date === 'string') {
    const d = parseISO(date)
    return isValid(d) ? d : undefined
  }
  return undefined
}

export function formatDate(date: Date | string, formatString: string) {
  const valid = validDate(date)
  if (valid) return format(valid, formatString)
  return ''
}
