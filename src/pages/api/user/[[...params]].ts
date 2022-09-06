import { hashSync } from 'bcrypt'
import { instanceToPlain } from 'class-transformer'
import { parseISO } from 'date-fns'
import {
  BadRequestException,
  createHandler,
  Delete,
  Get,
  HttpCode,
  HttpException,
  InternalServerErrorException,
  Patch,
  Post,
  Req
} from 'next-api-decorators'

import { formatDate } from '~/helpers/date'
import { generatePassword } from '~/helpers/string'
import { prepareConnection } from '~/server-side/database/conn'
import { parseOrderDto } from '~/server-side/database/db.helper'
import { createEmailService } from '~/server-side/services/EmailService'
import { PaginateService } from '~/server-side/services/PaginateService'
import { Pagination } from '~/server-side/services/PaginateService'
import type { AuthorizedPaginationApiRequest } from '~/server-side/services/PaginateService/paginate.middleware'
import type { AuthorizedApiRequest, PublicApiRequest } from '~/server-side/useCases/auth/auth.dto'
import { JwtAuthGuard, IfAuth } from '~/server-side/useCases/auth/middleware'
import { Payment } from '~/server-side/useCases/payment/payment.entity'
import { Subscription } from '~/server-side/useCases/subscriptions/subscriptions.entity'
import { IUser, IUserFilter } from '~/server-side/useCases/user/user.dto'
import { User } from '~/server-side/useCases/user/user.entity'
import { checkCompleteData } from '~/server-side/useCases/user/user.helper'

const searchFields = ['id', 'name', 'email', 'cpf', 'phone', 'nick']
const otherSearch = ['Category.title']
const orderFields = [
  ['User.id', 'id'],
  ['User.name', 'name'],
  ['User.nick', 'nick']
]

class UserHandler {
  @Get('/find-one')
  @HttpCode(200)
  @JwtAuthGuard()
  async findUser(@Req() req: AuthorizedApiRequest<any, IUserFilter>) {
    const ds = await prepareConnection()
    const repo = ds.getRepository(User)

    const { id, name, cpf, email } = req.query

    const hasFilter = Object.keys(req.query)?.length > 1 // for params array inside req.query
    let user: User = null

    if (hasFilter) {
      const where = { id, name, cpf, email }
      user = await repo.findOne({ where })
      if (!user) throw new InternalServerErrorException('Usuário não encontrado')
    }

    return { success: true, user, auth: req.auth }
  }

  @Post('/register')
  @HttpCode(201)
  async createUser(@Req() req: PublicApiRequest<IUser>) {
    const { body } = req

    if (body?.email) body.email = body.email.toLowerCase().trim()

    const ds = await prepareConnection()
    const repo = ds.getRepository(User)
    const userData = repo.create({ ...body })

    const userExists = await repo.findOne({ where: { email: userData.email } })
    if (userExists) throw new HttpException(401, 'Usuário já existe')
    if (!userData?.password) throw new BadRequestException('Senha não obrigatória')

    const hashPassword = hashSync(userData.password, 14)

    const user = await repo.save({ ...userData, password: hashPassword })

    return { success: !!user, userId: user?.id }
  }

  @Patch('/:userId')
  @JwtAuthGuard()
  @HttpCode(200)
  async updateUser(@Req() req: AuthorizedApiRequest<IUser>) {
    const { body, query } = req

    const userId = query?.params
    if (!userId) throw new BadRequestException('Usuário inválido')

    if (body?.email) body.email = body.email.toLowerCase().trim()
    if (body.birday) body.birday = formatDate(body.birday, 'yyyy-MM-dd HH:mm:ss')

    const ds = await prepareConnection()
    const repo = ds.getRepository(User)
    const userData = repo.create({ ...body })

    const userExists = await repo.findOne({ where: { id: userId } })
    if (!userExists) throw new HttpException(401, 'Usuário não existe')

    const completed = checkCompleteData(userData)

    const user = await repo.update(userId, { ...userData, completed })

    return { success: !!user, userId }
  }

  @Delete('/:userId')
  @JwtAuthGuard()
  @HttpCode(200)
  async deleteUser(@Req() req: AuthorizedApiRequest<IUser>) {
    const { query } = req

    const userId = query?.params
    if (!userId) throw new BadRequestException('Usuário não encontrado')

    const ds = await prepareConnection()
    const repo = ds.getRepository(User)

    const totalSubscriptions = await ds.getRepository(Subscription).createQueryBuilder().select().where({ userId }).getCount()
    const totalPayments = await ds.getRepository(Payment).createQueryBuilder().select().where({ userId }).getCount()

    if (totalSubscriptions > 0 || totalPayments > 0) {
      throw new HttpException(403, `Usuário não pode ser excluído ${totalSubscriptions} ${totalPayments}`)
    }

    const result = await repo.createQueryBuilder('User').delete().where('id = :userId', { userId }).execute()

    return { success: !!result?.affected, userId, affected: result?.affected }
  }

  @Patch()
  @JwtAuthGuard()
  @HttpCode(200)
  async saveMe(@Req() req: AuthorizedApiRequest<IUser>) {
    const ds = await prepareConnection()
    const repo = ds.getRepository(User)
    const userId = req?.auth?.userId
    const { birday, email, ...data } = req?.body

    const u: Partial<IUser> = { ...data }
    if (email) u.email = email.toLowerCase().trim()
    if (birday) u.birday = parseISO(`${birday}`)

    if (!userId) throw new BadRequestException('Usuário não encontrado')
    const user = await repo.update(userId, u)

    const toCheck = await repo.findOne({ where: { id: userId } })
    const completed = checkCompleteData(toCheck)
    await repo.update(userId, { completed })

    return { success: !!user, userId }
  }

  @Get('/find')
  @HttpCode(200)
  @JwtAuthGuard()
  async find(@Req() req: AuthorizedApiRequest) {
    const { query } = req

    const search = `${query?.search}`
    // const tournamentId = +query?.tournamentId
    // const categoryId = +query?.categoryId
    if (!search) return { success: true, users: [] }

    const ds = await prepareConnection()
    const repo = ds.getRepository(User)

    const fields = searchFields.map(f => `User.${f}`)

    const queryText = search ? [...fields.map(field => `${field} LIKE :search`), ...otherSearch.map(field => `${field} LIKE :search`)] : null

    const queryDb = repo
      .createQueryBuilder('User')
      .select([...fields, 'User.completed'])
      .addSelect(['Subscription.id', 'Subscription.userId', 'Subscription.categoryId', 'Subscription.paid'])
      .addSelect(['Category.id', 'Category.title'])
      .addSelect(['Tournament.id', 'Tournament.title'])
      .leftJoin('User.userSubscriptions', 'Subscription')
      .leftJoin('Subscription.category', 'Category')
      .leftJoin('Category.tournament', 'Tournament')
      .orderBy('User.name', 'ASC')
      .limit(10)

    queryDb.andWhere(`(${queryText.join(' OR ')})`, { search: `%${search}%` })

    const users = (await queryDb.getMany()) || []

    return { success: true, users: users.map(u => instanceToPlain(u)) }
  }

  @Post('/forgot')
  @IfAuth()
  @HttpCode(200)
  async forgot(@Req() req: AuthorizedApiRequest) {
    const { email = '' } = req.body

    const ds = await prepareConnection()
    const repo = ds.getRepository(User)

    const user = await repo.findOne({ where: { email: email.toLowerCase().trim() } })
    if (!user) throw new BadRequestException('Usuário não encontrado')

    const publicCode = generatePassword()
    const privateCode = generatePassword()

    const updated = await repo.update(user.id, { reset: `${publicCode}:${privateCode}` })
    if (!updated) throw new BadRequestException('database_error')

    const mailService = createEmailService()

    const sent = await mailService.send({
      from: 'lesbr3@gmail.com',
      subject: 'N2BT - Recuperação de senha',
      to: user.email,
      html: `<p>
      Seu c&oacute;digo para recupera&ccedil;&atilde;o de senha:<br /><br /><strong style="font-size:26px">${publicCode}</strong><br /><br />
      Informe o c&oacute;digo acima no local indicado da p&aacute;gina.<br /><br />
      <p/>`
    })

    if (!sent?.accepted?.length) throw new BadRequestException('email_error')

    return { success: true, code: privateCode }
  }

  @Post('/code')
  @IfAuth()
  @HttpCode(200)
  async code(@Req() req: AuthorizedApiRequest) {
    const { privateCode, userCode } = req.body

    const ds = await prepareConnection()
    const repo = ds.getRepository(User)

    const user = await repo.findOne({ where: { reset: `${userCode}:${privateCode}` } })
    if (!user) throw new BadRequestException('Código inválido')

    const authorization = generatePassword()

    const updated = await repo.update(user.id, { reset: `${authorization}`, emailVerified: new Date() })
    if (!updated) throw new BadRequestException('Erro ao atualizar')

    return { success: true, userId: user.id, authorization }
  }

  @Post('/reset')
  @IfAuth()
  @HttpCode(200)
  async reset(@Req() req: AuthorizedApiRequest) {
    const { password, userId, authorization } = req.body

    const ds = await prepareConnection()
    const repo = ds.getRepository(User)

    const user = await repo.findOne({ where: { reset: authorization, id: userId } })
    if (!user) throw new BadRequestException('invalid_authorizationCode')

    const hashPassword = hashSync(password, 14)
    const updated = await repo.update(user.id, { reset: null, password: hashPassword })
    if (!updated || !updated?.affected) throw new BadRequestException('database_error')

    return { success: true, userId: user.id, affected: updated?.affected }
  }

  @Get()
  @JwtAuthGuard()
  @Pagination()
  @HttpCode(200)
  async users(@Req() req: AuthorizedPaginationApiRequest) {
    const ds = await prepareConnection()
    const repo = ds.getRepository(User)

    const { search, order } = req.pagination

    const fields = searchFields.map(f => `User.${f}`)
    const queryText = search ? [...fields.map(field => `${field} LIKE :search`)] : null

    const query = repo
      .createQueryBuilder('User')
      .select()
      .loadRelationCountAndMap('User.totalSubscriptions', 'User.userSubscriptions', 'Subscription')
      .loadRelationCountAndMap('User.totalPayments', 'User.payments', 'Payment')
    // .addSelect(['Company.id', 'Company.name'])
    // .innerJoin('Jobtitle.company', 'Company');

    if (queryText) query.andWhere(`(${queryText.join(' OR ')})`, { search: `%${search}%` })
    parseOrderDto({ order, table: 'User', orderFields }).querySetup(query)

    const paginateService = new PaginateService('users')
    const paginated = await paginateService.paginate(query, req.pagination)
    return { success: true, ...paginated }
  }
}

export default createHandler(UserHandler)
