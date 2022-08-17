import { combineReducers } from 'redux'
import createWebStorage from 'redux-persist/lib/storage/createWebStorage'

import { appName, appVersion } from '~/config'

import auth from './auth'

const isServer = typeof window === 'undefined'

export const rootReducer = combineReducers({
  auth
})

function createNoopStorage() {
  return {
    getItem(_key: string) {
      return Promise.resolve(null)
    },
    setItem(_key: string, value: any) {
      return Promise.resolve(value)
    },
    removeItem(_key: string) {
      return Promise.resolve()
    }
  }
}

function createStorage() {
  const storage = isServer ? createNoopStorage() : createWebStorage('local')
  return storage
}

export const persistConfig = {
  key: `store-${appName}-${appVersion}`,
  storage: createStorage(),
  whitelist: ['user', 'auth', 'app', 'arch', 'notifications']
}
