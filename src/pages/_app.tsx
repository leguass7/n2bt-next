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
import { UserProvider } from '~/components/UserProvider'
import { store, persistor } from '~/store'

import 'react-toastify/dist/ReactToastify.min.css'
import 'react-circular-progressbar/dist/styles.css'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ReduxProvider store={store}>
      <PersistGate loading={<StorageLoading />} persistor={persistor}>
        <SessionProvider session={pageProps?.session}>
          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBr}>
            <UserProvider>
              <AppThemeProvider themeName="common">
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
              </AppThemeProvider>
            </UserProvider>
          </LocalizationProvider>
        </SessionProvider>
      </PersistGate>
    </ReduxProvider>
  )
}

export default MyApp
