import type { DataSource, DeepPartial } from 'typeorm'

import { Subscription } from './subscriptions.entity'

export class SubscriptionService {
  constructor(private readonly ds: DataSource) {}

  async getOne(id: number, relations?: boolean) {
    const repo = this.ds.getRepository(Subscription)
    const query = repo.createQueryBuilder('Subscription').where('Subscription.id = :id', { id }).leftJoinAndSelect('Subscription.payment', 'Payment')
    if (relations) {
      query
        .addSelect(['User.id', 'User.name', 'User.email', 'User.cpf'])
        .innerJoin('Subscription.user', 'User')
        .addSelect(['Category.id', 'Category.title'])
        .innerJoin('Subscription.category', 'Category')
        .addSelect(['Tournament.id', 'Tournament.title', 'Tournament.subscriptionEnd'])
        .innerJoin('Category.tournament', 'Tournament')
    }
    const result = await query.getOne()
    return result
  }

  async store(data: DeepPartial<Subscription>) {
    const repo = this.ds.getRepository(Subscription)
    const toSave = repo.create(data)
    const result = await repo.save(toSave)
    return result
  }

  async update(subscriptionId: number, data: DeepPartial<Subscription>) {
    const repo = this.ds.getRepository(Subscription)
    const result = await repo.update(subscriptionId, { ...data, updatedAt: new Date() })
    return result
  }
}
