import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Unique } from 'typeorm'
import { ManyToOne } from 'typeorm/decorator/relations/ManyToOne'

import { Block } from '../block/block.entity'

@Unique('block_id_label', ['blockId', 'label'])
@Entity('block_fields')
export class BlockField {
  @PrimaryGeneratedColumn('increment', { unsigned: true })
  id: number

  @Column()
  label: string

  @Column({ unsigned: true })
  blockId: number

  @ManyToOne(() => Block, block => block.fields)
  block?: Block

  @Column()
  startDate: Date

  @Column()
  endDate: Date

  @Column({ type: 'double', unsigned: true, default: 0 })
  price?: number

  @Column({ default: false })
  actived?: boolean

  @Column({ default: false })
  paid?: boolean

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
