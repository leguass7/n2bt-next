import { configureStore, type ThunkAction, type Action, type Middleware } from '@reduxjs/toolkit'
import { createWrapper } from 'next-redux-wrapper'
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist'

import { dev } from '~/config'

import { persistConfig, rootReducer } from './reducers'

const middlewares: Middleware[] = []
const ignoredActions = [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]

const persistedReducer = persistReducer(persistConfig, rootReducer)

function makeStore() {
  return configureStore({
    reducer: persistedReducer,
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware({
        serializableCheck: { ignoredActions, warnAfter: 500 },
        immutableCheck: { warnAfter: 500 } // corrige console.warn (default = 32ms)
      }).concat(...middlewares)
  })
}

const store = makeStore()
const persistor = persistStore(store)

export const wrapper = createWrapper(makeStore, { debug: !!dev })

export type AppStoreState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppStoreState, unknown, Action<string>>

export { store, persistor }
