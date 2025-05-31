import { Controller, Inject } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { PubSub } from 'graphql-subscriptions';

const RESPONSE_PATTERN = process.env.RESPONSE_PATTERN || 'query.response';

@Controller()
export class CollectionsController {
  constructor(@Inject('PUB_SUB') private readonly pubSub: PubSub) {}

  @EventPattern(RESPONSE_PATTERN)
  async queryDocument(data: {
    userId: number;
    token: string;
    completed: boolean;
  }) {
    this.pubSub.publish(`query.${data.userId}`, {
      queryCollection: {
        token: data.token,
        completed: data.completed,
      },
    });
  }
}
