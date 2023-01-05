import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

import { Config } from '~/server-side/useCases/config/config.entity'
import { Tournament } from '~/server-side/useCases/tournament/tournament.entity'
import type { User } from '~/server-side/useCases/user/user.entity'

import { PlayField } from '../play-field/play-field.entity'

@Entity('arenas')
export class Arena {
  @PrimaryGeneratedColumn('increment', { unsigned: true })
  id: number

  @Column({ type: 'uuid', nullable: false, length: 36 })
  userId: string

  @Column({ length: 128 })
  title: string

  @Column({ type: 'longtext', nullable: true })
  description?: string

  @Column({ nullable: true, default: false })
  published: boolean

  @Column({ type: 'uuid', nullable: true, length: 36 })
  createdBy?: string

  @Column({ type: 'datetime', nullable: true, precision: null, default: () => 'CURRENT_TIMESTAMP' })
  createdAt?: Date

  @Column({ type: 'uuid', nullable: true, length: 36 })
  updatedBy?: string

  @Column({ nullable: true, precision: null, onUpdate: 'CURRENT_TIMESTAMP', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt?: Date

  @OneToMany(() => Tournament, tournament => tournament.arena)
  tournaments?: Tournament[]

  // relations user
  @ManyToOne('User', 'arenas', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId', referencedColumnName: 'id', foreignKeyConstraintName: 'arenas_userId_fkey' })
  user: User

  @ManyToOne('User', 'createdArenas', { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'createdBy', referencedColumnName: 'id', foreignKeyConstraintName: 'arenas_createdBy_fkey' })
  createdUser?: User

  @ManyToOne('User', 'updatedArenas', { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'updatedBy', referencedColumnName: 'id', foreignKeyConstraintName: 'arenas_updatedBy_fkey' })
  updatedUser?: User

  // relations Configs
  @OneToMany(() => Config, config => config.arena)
  configs?: Config[]

  // relations PlayField
  @OneToMany(() => PlayField, field => field.arenaId)
  playFields?: PlayField[]
}
