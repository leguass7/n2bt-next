import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('checkin')
export class Checkin {
  @PrimaryGeneratedColumn('increment', { unsigned: true })
  id: string

  @Column({ unsigned: true, nullable: true, default: null })
  tournamentId?: number

  @Column({ type: 'uuid', nullable: true, length: 36, default: null })
  userId: string

  @Column({ nullable: true, default: false })
  check: boolean

  @Column({ type: 'uuid', nullable: true, length: 36 })
  createdBy?: string

  @Column({ type: 'datetime', nullable: true, precision: null, default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  createdAt?: Date
}
