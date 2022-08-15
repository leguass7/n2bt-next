import type { ValueTransformer } from 'typeorm'

export const transformer: Record<'date' | 'bigint' | 'decimal', ValueTransformer> = {
  date: {
    from: (date: string | null) => date && new Date(parseInt(date, 10)),
    to: (date?: Date) => date?.valueOf().toString()
  },
  bigint: {
    from: (bigInt: string | null) => bigInt && parseInt(bigInt, 10),
    to: (bigInt?: number) => bigInt?.toString()
  },
  decimal: {
    from: (value: string | null) => (value && parseFloat(value)) || 0,
    to: (value?: number) => value || 0
  }
}
