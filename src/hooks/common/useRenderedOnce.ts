import { DependencyList, EffectCallback, useEffect, useRef } from 'react'

export const useEffectExceptOnMount = (callback: EffectCallback, deps: DependencyList) => {
  const isMounted = useRef(false)
  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true
      return
    }
    callback()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
