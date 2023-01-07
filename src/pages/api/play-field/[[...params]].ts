import { Body, createHandler, Get, InternalServerErrorException, Param, Patch, Post, Query, Req, ValidationPipe } from 'next-api-decorators'
import type { DataSource } from 'typeorm'
import type { FindOptionsWhere } from 'typeorm/find-options/FindOptionsWhere'

import { prepareConnection } from '~/server-side/database/conn'
import type { AuthorizedApiRequest } from '~/server-side/useCases/auth/auth.dto'
import { JwtAuthGuard } from '~/server-side/useCases/auth/middleware'
import { CreatePlayFieldDTO } from '~/server-side/useCases/play-field/dto/create-play-field.dto'
import { FilterPlayFieldDTO } from '~/server-side/useCases/play-field/dto/filter-play-field.dto'
import { UpdatePlayFieldDTO } from '~/server-side/useCases/play-field/dto/update-play-field.dto'
import { PlayField } from '~/server-side/useCases/play-field/play-field.entity'

const Pipe = ValidationPipe({ whitelist: true, forbidUnknownValues: true })

class PlayFieldHandler {
  private connection: Promise<DataSource>

  constructor() {
    this.connection = prepareConnection()
  }

  @Get('/list/:arenaId')
  async listArenaFields(@Param('arenaId') arenaId: number, @Query(Pipe) filter: FilterPlayFieldDTO) {
    const ds = await this.connection
    const repo = ds.getRepository(PlayField)

    const defaultFilter: FindOptionsWhere<PlayField> = { arenaId, actived: true }

    const data = (await repo.find({ where: { ...filter, ...defaultFilter } })) ?? []

    return { data }
  }

  @Get('/:fieldId')
  async getOne(@Param('fieldId') fieldId: string) {
    const id = parseInt(fieldId)

    const ds = await this.connection
    const repo = ds.getRepository(PlayField)

    const data = await repo.findOne({ where: { id } })
    if (!data) throw new InternalServerErrorException('Field not found')

    return { data }
  }

  @Post()
  @JwtAuthGuard()
  async create(@Body(Pipe) dto: CreatePlayFieldDTO, @Req() req: AuthorizedApiRequest<any, any>) {
    const ds = await this.connection
    const repo = ds.getRepository(PlayField)

    const { userId } = req?.auth

    const defaultValues = { createdBy: userId, updatedBy: userId, actived: true }

    const data = await repo.save({ ...defaultValues, ...dto })
    if (!data) throw new InternalServerErrorException('Error in field creation')

    return { data, message: 'Campo criado com sucesso' }
  }

  @Patch('/:fieldId')
  @JwtAuthGuard()
  async update(@Param('fieldId') fieldId: number, @Body(Pipe) dto: UpdatePlayFieldDTO, @Req() req: AuthorizedApiRequest<any, any>) {
    const ds = await this.connection
    const repo = ds.getRepository(PlayField)
    const { userId } = req?.auth

    const data = await repo.update(fieldId, { ...dto, createdBy: userId, updatedBy: userId })
    if (!data) throw new InternalServerErrorException('Error in field update')

    return { data, message: 'Campo atualizado com sucesso' }
  }
}

export default createHandler(PlayFieldHandler)
