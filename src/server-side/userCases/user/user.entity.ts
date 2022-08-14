import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ nullable: true, default: null })
  name: string

  @Column({ unique: true, nullable: true, default: null })
  email: string
}
