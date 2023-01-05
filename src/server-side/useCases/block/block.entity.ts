import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm'

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
