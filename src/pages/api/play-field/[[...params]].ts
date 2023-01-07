import { Body, createHandler, Get, InternalServerErrorException, Param, Patch, Post, Query, ValidationPipe } from 'next-api-decorators'
import type { DataSource } from 'typeorm'

import { prepareConnection } from '~/server-side/database/conn'
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

    const data = (await repo.find({ where: { ...filter, arenaId } })) ?? []

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
  async create(@Body(Pipe) dto: CreatePlayFieldDTO) {
    const ds = await this.connection
    const repo = ds.getRepository(PlayField)

    const data = await repo.save(dto)
    if (!data) throw new InternalServerErrorException('Error in field creation')

    return { data }
  }

  @Patch('/:fieldId')
  @JwtAuthGuard()
  async update(@Param('fieldId') fieldId: number, @Body(Pipe) dto: UpdatePlayFieldDTO) {
    const ds = await this.connection
    const repo = ds.getRepository(PlayField)

    const data = await repo.update(fieldId, dto)
    if (!data) throw new InternalServerErrorException('Error in field update')

    return { data }
  }
}

export default createHandler(PlayFieldHandler)
