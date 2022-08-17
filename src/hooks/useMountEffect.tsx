import { useEffect } from 'react'

type Callback = (...args: any[]) => Promise<any> | any

export function useMountEffect(fun: Callback) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useEffect(fun, [])
}
