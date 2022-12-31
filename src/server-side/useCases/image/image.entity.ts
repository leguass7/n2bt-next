import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
  // AfterInsert,
  // AfterUpdate,
  // AfterLoad,
  // BeforeUpdate,
  // BeforeInsert
} from 'typeorm'

// import { conventFieldInDto, conventFieldOutDto } from '~/server-side/database/db.helper'
import type { Tournament } from '~/server-side/useCases/tournament/tournament.entity'
import type { User } from '~/server-side/useCases/user/user.entity'

import type { IImageMetadata } from './image.dto'

@Entity('images')
export class Image {
  @PrimaryGeneratedColumn('increment', { unsigned: true })
  id: number

  @Column({ type: 'enum', enum: ['tournament', 'category'] })
  feature: number

  @Column({ unsigned: true, nullable: false })
  featureId: number

  @Column()
  label: string

  @Column({ type: 'longtext', default: null, nullable: true })
  url: string

  @Column({ unsigned: true, nullable: true, default: 0 })
  size: number

  @Column({ unsigned: true, nullable: true, default: 0 })
  width: number

  @Column({ unsigned: true, nullable: true, default: 0 })
  height: number

  @Column({ type: 'json', default: null, nullable: true })
  metaData: IImageMetadata

  @Column({ nullable: true, default: true })
  actived: boolean

  @Column({ type: 'uuid', nullable: true, length: 36 })
  createdBy?: string

  @Column({ type: 'datetime', nullable: true, precision: null, default: () => 'CURRENT_TIMESTAMP' })
  createdAt?: Date

  // relations
  @ManyToOne('Tournament', 'images', { onDelete: 'NO ACTION', onUpdate: 'NO ACTION', createForeignKeyConstraints: false })
  @JoinColumn({ name: 'tournamentId', referencedColumnName: 'id' })
  tournament: Tournament

  // relations user
  @ManyToOne('User', 'createdImages', { onDelete: 'SET NULL', onUpdate: 'SET NULL' })
  @JoinColumn({ name: 'createdBy', referencedColumnName: 'id', foreignKeyConstraintName: 'images_createdBy_fkey' })
  createdUser?: User

  // @AfterInsert()
  // @AfterUpdate()
  // @AfterLoad()
  // convertOut() {
  //   this.metaData = this?.metaData ? conventFieldOutDto(this.metaData) : null
  // }

  // @BeforeUpdate()
  // @BeforeInsert()
  // convertInsert() {
  //   this.metaData = this?.metaData ? (conventFieldInDto(this.metaData) as IImageMetadata) : null
  // }
}
