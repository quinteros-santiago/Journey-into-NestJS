import { Injectable } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { RabbitMQConnectionService } from './rabbitmq.connection';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/user/user.schema';

@Injectable()
export class RabbitMQService {
  private readonly logger = new Logger(RabbitMQService.name);
  private readonly rabbitQueue: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly rabbitMQConnectionService: RabbitMQConnectionService,
  ) {
    this.rabbitQueue = this.configService.get<string>('RABBIT_QUEUE');
  }

  async sendEvents(users: User[]): Promise<void> {
    for await (const user of users) {
      await this.sendEvent(user.userId);
    }
  }

  private async sendEvent(eventUserId: number): Promise<void> {
    const channel = this.rabbitMQConnectionService.getChannel();

    if (channel) {
      const event = `{"userId":${eventUserId},"queue":"${this.rabbitQueue}"}`;

      try {
        channel.sendToQueue(this.rabbitQueue, Buffer.from(event));
        this.logger.debug(`Rabbit event sent, event: ${event}`);
      } catch (exception) {
        this.logger.error(
          `Unexpected error when sending rabbit event: ${event}. ${exception}`,
        );
      }
    }
  }
}
