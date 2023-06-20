import { Module } from '@nestjs/common';
import { RabbitMQService } from './rabbitmq.service';
import { RabbitMQConnectionService } from './rabbitmq.connection';

@Module({
  imports: [],
  controllers: [],
  providers: [RabbitMQService, RabbitMQConnectionService],
  exports: [RabbitMQService],
})
export class RabbitMQModule {}
