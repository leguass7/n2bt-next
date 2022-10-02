import type { IThemeSpacing } from './types'

const rounded = 5
const spacing: IThemeSpacing = {
  xs: 2,
  s: 4,
  m: 6,
  l: 10,
  xl: 14
}

export const appTheme = {
  colors: {
    // primary: '#F56268',
    primary: '#0E3F80', // summer
    // secondary: '#2F5597',
    secondary: '#CDBE55', //summer
    // contrast: '#235910',
    contrast: '#CDBE55', // summer
    // background: '#323B62',
    background: '#0593B1', // summer
    text: '#818181',
    textDark: '#151414',

    white: '#FFFFFF',
    black: '#000000',
    border: '#ccc',
    shadow: '#C3C3C3',

    success: '#2E7D32',
    errors: '#D32F2F',
    warning: '#ED6C02',
    info: '#0288D1'
  },
  spacing,
  rounded,
  borderWidth: 1
}

export type IAppTheme = typeof appTheme

export const themes = {
  common: appTheme
}

export type ThemeName = keyof typeof themes
