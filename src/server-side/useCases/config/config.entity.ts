import {
  AfterInsert,
  AfterLoad,
  AfterUpdate,
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique
} from 'typeorm'

import type { Arena } from '~/server-side/useCases/arena/arena.entity'
import type { User } from '~/server-side/useCases/user/user.entity'

import type { ConfigValue, ConfigKey } from './config.dto'
import { configInDto, configOutDto } from './config.helper'

@Unique('config_arenaId_key_key', ['arenaId', 'key'])
@Entity('config')
export class Config {
  @PrimaryGeneratedColumn('increment', { unsigned: true })
  id: string

  @Column({ unsigned: true, nullable: true, default: null })
  arenaId?: number

  @Column({ type: 'enum', enum: ['CERT_DEV', 'CERT', 'PIX', 'OTHER'] })
  key: ConfigKey

  @Column({ type: 'longtext', nullable: true, default: null })
  value: string | ConfigValue

  @Column({ type: 'uuid', nullable: true, length: 36 })
  createdBy?: string

  @Column({ type: 'datetime', nullable: true, precision: null, default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  createdAt?: Date

  // hooks
  @AfterInsert()
  @AfterUpdate()
  @AfterLoad()
  convertOut() {
    if (this?.key === 'OTHER' && this?.value) {
      this.value = configOutDto(this.value)
    }
  }

  @BeforeUpdate()
  @BeforeInsert()
  convertIn() {
    if (this?.key === 'OTHER' && this?.value) {
      this.value = configInDto(this.value)
    }
  }

  // relations
  @ManyToOne('User', 'configs', { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'createdBy', referencedColumnName: 'id', foreignKeyConstraintName: 'configs_createdBy_fkey' })
  user?: User

  @ManyToOne('Arena', 'configs', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'arenaId', referencedColumnName: 'id', foreignKeyConstraintName: 'configs_arenaId_fkey' })
  arena?: Arena
}
