// import { OAuthUserConfig } from 'next-auth/providers'

import pkg from '../../package.json'
export const dev = process.env.NODE_ENV !== 'production'

const virtualHost = `${process.env.NEXT_PUBLIC_VIRTUAL_HOST}` || ''
const vhost = typeof virtualHost === 'undefined' || virtualHost === 'undefined' ? '' : virtualHost
export const host = dev ? 'localhost:3000' : vhost || ''

export const appName = pkg.name
export const appVersion = pkg.version

export const isServer = typeof window === 'undefined' ? true : false
export const appBaseURL = `http${dev ? '' : 's'}://${host}`
