import camelcaseKeys from 'camelcase-keys'
import type { SelectQueryBuilder } from 'typeorm'

import { formatInTimeZone } from '~/helpers/dates'
import { ArrayOrder } from '~/server-side/services/PaginateService'

type DateTostringBetweenDto = {
  startDate?: string
  endDate?: string
}
type Param = {
  startDate?: Date
  endDate?: Date
}
export function dateTostringBetweenDto({ startDate = null, endDate = null }: Param): DateTostringBetweenDto {
  const result: DateTostringBetweenDto = {}

  if (startDate) result.startDate = `${formatInTimeZone(startDate, 'yyyy-MM-dd', 'UTC')} 00:00:00`
  if (endDate) result.endDate = `${formatInTimeZone(endDate, 'yyyy-MM-dd', 'UTC')} 23:59:59`

  return result
}

export function addWhereBetween<T = unknown>(fieldName: string, queryBuilder: SelectQueryBuilder<T>, { startDate = null, endDate = null }: Param) {
  const dates = dateTostringBetweenDto({ startDate, endDate })
  if (startDate && endDate) {
    queryBuilder.andWhere(`${fieldName} BETWEEN :startDate AND :endDate`, { ...dates })
  } else if (startDate) {
    queryBuilder.andWhere(`${fieldName} >= :startDate`, { ...dates })
  } else if (endDate) {
    queryBuilder.andWhere(`${fieldName} <= :endDate`, { ...dates })
  }
  return queryBuilder
}

export function rawResultMapDto<T = any>(fieldMap: string[] = [], rawResult: any[]): T[] {
  // const hasMap = (str: string) => !!fieldMap.includes(str);

  const extractMap = (str: string) => {
    const [keyMaped, ...rest] = str.split('_')
    return keyMaped && rest.length ? [keyMaped.toLowerCase(), rest.join('_')] : null
  }

  const findFieldMap = (str: string) => {
    const found = fieldMap.find(m => str.startsWith(`${m}_`))
    return found ? extractMap(str) : null
  }

  return rawResult.map(item => {
    const row = Object.keys(item).reduce((acc, key) => {
      const found = findFieldMap(key)
      if (found) {
        if (acc[found[0]]) acc[found[0]][found[1]] = item[key]
        else {
          acc[found[0]] = { [found[1]]: item[key] }
        }
      } else {
        acc[key] = item[key]
      }
      return acc
    }, {})

    return camelcaseKeys(row, { deep: true })
  }, []) as T[]
}

export interface IParseOrderParams {
  order: ArrayOrder[]
  table?: string
  orderFields?: string[][]
  ignoreFields?: string[]
}

export function parseOrderDto({ order, table, ignoreFields = [], orderFields = [] }: IParseOrderParams) {
  const orders: ArrayOrder[] = []
  if (order && order.length) {
    order.forEach(ord => {
      if (!ignoreFields.includes(ord[0])) {
        const found = orderFields.find(f => f.includes(ord[0]))
        const t = table ? `${table}.${ord[0]}` : `${ord[0]}`
        orders.push([found ? found[0] : `${t}`, ord[1] as ArrayOrder['1']])
      }
    })
  }

  return {
    orders,
    querySetup<T = unknown>(query: SelectQueryBuilder<T>) {
      orders.forEach(ord => query.addOrderBy(ord[0], ord[1]))
      return query
    },
    toString() {
      return orders.map(ord => ord.join(' ')).join(',')
    }
  }
}

// export function phpSerializeDto<T = Record<string, any>>(data: T): string
// export function phpSerializeDto<T = Record<string, any>>(data: string): T
// export function phpSerializeDto<T = string>(data: T): string[]
// export function phpSerializeDto<T = any[]>(data: T): string
// export function phpSerializeDto<T = Record<string, any>>(data: any): any {
//   if (typeof data === 'string') {
//     return (data ? unserialize(data) : {}) as T
//   }
//   // const a = data ? serialize(data) : null;
//   return data ? (serialize(data) as string) : null
// }
