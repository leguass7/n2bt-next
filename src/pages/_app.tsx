import { Provider as ReduxProvider } from 'react-redux'
import { ToastContainer } from 'react-toastify'

import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import ptBr from 'date-fns/locale/pt-BR'
import { SessionProvider } from 'next-auth/react'
import type { AppProps } from 'next/app'
import { PersistGate } from 'redux-persist/integration/react'

import { StorageLoading } from '~/components/app/StorageLoading'
import { AppThemeProvider } from '~/components/AppThemeProvider'
import { PassRollProvider } from '~/components/PassRollLayout'
import { UserProvider } from '~/components/UserProvider'
import { store, persistor } from '~/store'

import 'react-toastify/dist/ReactToastify.min.css'
import 'react-circular-progressbar/dist/styles.css'
import 'react-perfect-scrollbar/dist/css/styles.css'

const MyApp: React.FC<AppProps<any>> = ({ Component, pageProps }) => {
  const isStatic = !!pageProps?.isStatic

  if (isStatic)
    return (
      <ReduxProvider store={store}>
        <PersistGate loading={<StorageLoading />} persistor={persistor}>
          <SessionProvider session={pageProps?.session}>
            <Component {...pageProps} />
          </SessionProvider>
        </PersistGate>
      </ReduxProvider>
    )
  return (
    <ReduxProvider store={store}>
      <PersistGate loading={<StorageLoading />} persistor={persistor}>
        <SessionProvider session={pageProps?.session}>
          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBr}>
            <UserProvider>
              {isStatic ? (
                <Component {...pageProps} />
              ) : (
                <AppThemeProvider themeName="common">
                  <PassRollProvider>
                    <Component {...pageProps} />
                    <ToastContainer
                      theme="colored"
                      position="top-right"
                      autoClose={3000}
                      hideProgressBar={false}
                      newestOnTop={false}
                      closeOnClick
                      draggable
                      pauseOnHover
                    />
                  </PassRollProvider>
                </AppThemeProvider>
              )}
            </UserProvider>
          </LocalizationProvider>
        </SessionProvider>
      </PersistGate>
    </ReduxProvider>
  )
}

export default MyApp
