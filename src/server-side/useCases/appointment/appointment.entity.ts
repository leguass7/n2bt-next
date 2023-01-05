import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm'
import { ManyToOne } from 'typeorm/decorator/relations/ManyToOne'

import { PlayField } from '../play-field/play-field.entity'
import { User } from '../user/user.entity'

@Entity('appointments')
export class Appointment {
  @PrimaryGeneratedColumn('increment', { unsigned: true })
  id: number

  @Column({ default: false })
  attendance?: boolean

  @Column({ default: false })
  actived?: boolean

  @Column()
  startDate: Date

  @Column()
  endDate: Date

  @Column({ unsigned: true })
  fieldId: number

  @Column({ length: 36 })
  userId: string

  @Column({ length: 36 })
  createdBy: string

  @Column({ length: 36 })
  updatedBy: string
  // Relations
  @ManyToOne(() => User, user => user.appointments)
  user?: User

  @ManyToOne(() => PlayField, field => field)
  field?: PlayField

  // Timestamps
  @CreateDateColumn()
  createdAt?: Date

  @UpdateDateColumn()
  updatedAt?: Date
}
