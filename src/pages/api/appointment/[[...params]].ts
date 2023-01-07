import { Body, createHandler, Get, Param, Patch, Post, Query, Req, ValidationPipe } from 'next-api-decorators'
import type { DataSource } from 'typeorm'
import type { FindOptionsWhere } from 'typeorm/find-options/FindOptionsWhere'

import { prepareConnection } from '~/server-side/database/conn'
import { Appointment } from '~/server-side/useCases/appointment/appointment.entity'
import { CreateAppointmentDTO } from '~/server-side/useCases/appointment/dto/create-appointment.dto'
import { FilterAppointmentDTO } from '~/server-side/useCases/appointment/dto/filter-appointment.dto'
import { UpdateAppointmentDTO } from '~/server-side/useCases/appointment/dto/update-appointment.dto'
import type { AuthorizedApiRequest } from '~/server-side/useCases/auth/auth.dto'
import { JwtAuthGuard } from '~/server-side/useCases/auth/middleware'
import { PlayField } from '~/server-side/useCases/play-field/play-field.entity'

const Pipe = ValidationPipe({ whitelist: true, forbidUnknownValues: true })

class AppointmentHandler {
  private connection: Promise<DataSource>

  constructor() {
    this.connection = prepareConnection()
  }

  @Get()
  async listAppointments(@Query(Pipe) filter: FilterAppointmentDTO) {
    const ds = await this.connection
    const repo = ds.getRepository(Appointment)

    const defaultFilter: FindOptionsWhere<PlayField> = { actived: true }

    const data = (await repo.find({ where: { ...defaultFilter, ...filter } })) ?? []

    return { data }
  }

  @Get('/:appointmentId')
  async getAppointment(@Param('appointmentId') appointmentId: string) {
    const ds = await this.connection
    const repo = ds.getRepository(Appointment)

    const id = parseInt(appointmentId)

    const data = await repo.findOne({ where: { id } })

    return { data }
  }

  @Post('/:fieldId')
  @JwtAuthGuard()
  async createAppointment(@Param('fieldId') fieldId: number, @Body(Pipe) dto: CreateAppointmentDTO, @Req() req: AuthorizedApiRequest) {
    const { level } = req.auth
    const isAdmin = !!(level >= 8)

    const userId = isAdmin ? dto?.userId ?? req.auth?.userId : req.auth?.userId

    const ds = await this.connection
    const repo = ds.getRepository(Appointment)

    const data = await repo.save({ ...dto, createdBy: userId, updatedBy: userId, userId, fieldId })

    return { data, message: 'Agendamento criado com sucesso' }
  }

  @Patch('/:appointmentId')
  @JwtAuthGuard()
  async updateAppointment(@Param('appointmentId') appointmentId: number, @Body(Pipe) dto: UpdateAppointmentDTO, @Req() req: AuthorizedApiRequest) {
    const { level } = req.auth
    const isAdmin = !!(level >= 8)

    const userId = isAdmin ? dto?.userId ?? req.auth?.userId : req.auth?.userId

    const ds = await this.connection
    const repo = ds.getRepository(Appointment)

    const data = await repo.update(appointmentId, { ...dto, updatedBy: userId, userId })

    return { data, message: 'Agendamento atualizado com sucesso' }
  }
}

export default createHandler(AppointmentHandler)
