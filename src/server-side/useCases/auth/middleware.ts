import { createMiddlewareDecorator, NextFunction, UnauthorizedException } from '@storyofams/next-api-decorators'
import type { NextApiResponse } from 'next'
import { getToken } from 'next-auth/jwt'
import { getSession } from 'next-auth/react'
import { parse } from 'next-useragent'

import { secret } from '~/server-side/config'
// import { prepareDataSource } from '~/server-side/database'

import type { AuthorizedApiRequest } from './auth.dto'
import { authorizedDto } from './auth.helper'

export const JwtAuthGuard = createMiddlewareDecorator(async (req: AuthorizedApiRequest, res: NextApiResponse, next: NextFunction) => {
  const unauthorize = (msg = 'unauthorized') => {
    return next(new UnauthorizedException(msg))
    // return res.status(401).json({ message: msg || 'unauthorized' })
  }

  try {
    // // console.log('secret', secret, process.env.NEXTAUTH_URL, process.env.VERCEL_URL)
    let session = await getToken({ req, secret })
    // console.log('session token', session)
    if (!session) {
      session = await getSession()
      // console.log('session session', session)
      if (!session) {
        return unauthorize()
      }
    }

    req.auth = authorizedDto(session)
    req.ua = req?.headers['user-agent'] ? parse(req.headers['user-agent']) : null
    // console.log('req.auth', req.auth)
    if (!req.auth?.userId) return unauthorize()

    next()
  } catch (error) {
    return unauthorize()
  }
})

export const IfAuth = createMiddlewareDecorator(async (req: AuthorizedApiRequest, res: NextApiResponse, next: NextFunction) => {
  try {
    let session = await getToken({ req, secret })
    if (!session) session = await getSession()

    req.auth = session ? authorizedDto(session) : null
    req.ua = req?.headers['user-agent'] ? parse(req.headers['user-agent']) : null

    next()
  } catch (error) {
    next()
  }
})
