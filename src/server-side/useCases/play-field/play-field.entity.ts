import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm'

import type { Appointment } from '../appointment/appointment.entity'
import type { Arena } from '../arena/arena.entity'

@Entity('play_fields')
export class PlayField {
  @PrimaryGeneratedColumn('increment', { unsigned: true, type: 'int' })
  id: number

  @Column({ unique: true })
  label: string

  @Column({ type: 'double', unsigned: true, default: 0 })
  price?: number

  @Column({ type: 'smallint', unsigned: true, default: 1 })
  appointmentLimit?: number

  @Column({ default: false })
  actived?: boolean

  @Column({ default: false })
  paid?: boolean

  @Column()
  startDate: Date

  @Column()
  endDate: Date

  @Column({ unsigned: true, type: 'int' })
  breakInMinutes: number

  @Column({ unsigned: true })
  arenaId: number

  @Column({ length: 36 })
  createdBy: string

  @Column({ length: 36 })
  updatedBy: string

  // Relations
  @ManyToOne('Arena', (arena: Arena) => arena.playFields)
  arena?: Arena

  @OneToMany('Appointment', (appointment: Appointment) => appointment.fieldId)
  appointments?: Appointment

  // Timestamps
  @CreateDateColumn()
  createdAt?: Date

  @UpdateDateColumn()
  updatedAt?: Date
}
