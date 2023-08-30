import { createContext } from 'react'

import { type IThemeContext } from './types'

const ThemeContext = createContext<IThemeContext>({} as IThemeContext)

export { ThemeContext }
