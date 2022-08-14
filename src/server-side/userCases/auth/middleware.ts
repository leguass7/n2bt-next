import { createMiddlewareDecorator, NextFunction, UnauthorizedException } from '@storyofams/next-api-decorators'
import type { NextApiRequest, NextApiResponse } from 'next'

function validateJwt(_req: NextApiRequest) {
  return false
}

export const JwtAuthGuard = createMiddlewareDecorator((req: NextApiRequest, res: NextApiResponse, next: NextFunction) => {
  if (!validateJwt(req)) {
    // throw new UnauthorizedException()
    // or
    return next(new UnauthorizedException())
  }

  next()
})

// export function exceptionHandler(error: unknown, req: NextApiRequest, res: NextApiResponse) {
//   const message = error instanceof Error ? error.message : 'An unknown error occurred.'
//   res.status(200).json({ success: false, message: message })
// }
