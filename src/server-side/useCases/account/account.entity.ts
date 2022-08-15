import type { ProviderType } from 'next-auth/providers'
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm'

import { transformer } from '~/server-side/database/transformer'
import { User } from '~/server-side/useCases/user/user.entity'

@Unique('accounts_provider_providerAccountId_key', ['provider', 'providerAccountId'])
@Entity('accounts')
export class Account {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'uuid' })
  userId: string

  @Column({ type: 'enum', enum: ['oauth', 'email', 'credentials'], nullable: false })
  type: ProviderType

  @Column({ nullable: false })
  provider: string

  @Column({ nullable: false })
  providerAccountId: string

  @Column({ type: 'text', nullable: true })
  refresh_token: string | null

  @Column({ type: 'text', nullable: true })
  access_token: string | null

  @Column({ nullable: true, type: 'bigint', transformer: transformer.bigint })
  expires_at: number | null

  @Column({ type: 'varchar', nullable: true })
  token_type: string | null

  @Column({ type: 'text', nullable: true, default: null })
  scope?: string | null

  @Column({ type: 'text', nullable: true })
  id_token: string | null

  @Column({ type: 'varchar', nullable: true })
  session_state: string | null

  @Column({ type: 'varchar', nullable: true })
  oauth_token_secret: string | null

  @Column({ type: 'varchar', nullable: true })
  oauth_token: string | null

  @ManyToOne('User', 'accounts', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId', referencedColumnName: 'id', foreignKeyConstraintName: 'accounts_userId_fkey' })
  user: User
}
