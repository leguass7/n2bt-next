import { MutableRefObject, useEffect, useRef } from 'react'

export function useIsMounted(): MutableRefObject<boolean> {
  const isMounted = useRef(true)

  useEffect(() => {
    return () => {
      isMounted.current = false
    }
  }, [])
  return isMounted
}
