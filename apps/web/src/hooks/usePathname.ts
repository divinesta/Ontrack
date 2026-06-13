import { useSyncExternalStore } from 'react'

const subscribe = (onStoreChange: () => void) => {
  window.addEventListener('popstate', onStoreChange)
  return () => window.removeEventListener('popstate', onStoreChange)
}

const getPathname = () => window.location.pathname

export const usePathname = () => useSyncExternalStore(subscribe, getPathname, () => '/')

export const navigate = (path: string) => {
  window.history.pushState({}, '', path)
  window.dispatchEvent(new PopStateEvent('popstate'))
}