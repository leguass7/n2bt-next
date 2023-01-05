import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm'

import { BlockField } from '../block-field/block-field.entity'

@Entity('blocks')
export class Block {
  @PrimaryGeneratedColumn('increment', { unsigned: true })
  id: number

  @Column({ unique: true })
  label: string

  @Column()
  rangeTime: Date

  @Column({ default: false })
  actived?: boolean

  @OneToMany(() => BlockField, blockField => blockField.blockId)
  fields?: BlockField[]

  // Relations
  @Column({ length: 36 })
  createdBy: string

  @Column({ length: 36 })
  updatedBy: string

  // Timestamps
  @CreateDateColumn()
  createdAt?: Date

  @UpdateDateColumn()
  updatedAt?: Date
}
