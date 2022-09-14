import { createHandler, Get, HttpCode, Req } from 'next-api-decorators'

import { Pagination } from '~/server-side/services/PaginateService'
import type { AuthorizedPaginationApiRequest } from '~/server-side/services/PaginateService/paginate.middleware'
import { JwtAuthGuard } from '~/server-side/useCases/auth/middleware'

class SubscriptionHandler {
  @Get('/list')
  @JwtAuthGuard()
  @Pagination()
  @HttpCode(200)
  async list(@Req() req: AuthorizedPaginationApiRequest) {
    //
    return { success: true }
  }
}

export default createHandler(SubscriptionHandler)
