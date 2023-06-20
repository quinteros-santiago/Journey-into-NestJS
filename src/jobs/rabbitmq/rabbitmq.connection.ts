import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import * as amqp from 'amqplib';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RabbitMQConnectionService
implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(RabbitMQConnectionService.name);
  private readonly rabbitURL: string;
  private readonly rabbitQueue: string;

  private connection: amqp.Connection;
  private channel: amqp.Channel;

  constructor(private readonly configService: ConfigService) {
    this.rabbitURL = this.configService.get<string>('RABBIT_URL');
    this.rabbitQueue = this.configService.get<string>('RABBIT_QUEUE');
  }

  async onModuleInit() {
    this.connection = await this.createConnection();
    this.channel = await this.createChannel();
    await this.assertQueue();
  }

  async onModuleDestroy() {
    await this.closeConnection();
  }

  getChannel(): amqp.Channel {
    return this.channel;
  }

  private async createConnection(): Promise<amqp.Connection> {
    if (!this.rabbitURL || this.rabbitURL === '') {
      this.logger.debug(
        'Rabbit connection was not provided. If you want the API to connect with Rabbit MQ, please provide a Rabbit MQ connection.',
      );
      return null;
    } else {
      let connection: amqp.Connection = null;

      try {
        connection = await amqp.connect(this.rabbitURL);
      } catch (exception) {
        this.logger.error(
          `RabbitMQ connection failed, none events will be sent to RabbitMQ. ${exception}`,
        );
        connection = null;
      } finally {
        return connection;
      }
    }
  }

  private async createChannel(): Promise<amqp.Channel> {
    let channel: amqp.Channel = null;

    if (this.connection) {
      try {
        channel = await this.connection.createChannel();
      } catch (exception) {
        this.logger.error(`Error while creating channel: ${exception}`);
        this.closeConnection();
      }
    }
    return channel;
  }

  private async assertQueue(): Promise<amqp.Replies.AssertQueue> {
    let queue: amqp.Replies.AssertQueue = null;

    if (this.connection) {
      try {
        queue = await this.channel.assertQueue(this.rabbitQueue, {
          durable: false,
        });
        this.logger.log('Connection with RabbitMQ established');
      } catch (exception) {
        this.logger.error(`Error while asserting queue: ${exception}`);
        this.closeConnection();
      }
    }
    return queue;
  }

  private async closeConnection(): Promise<void> {
    if (this.connection) {
      try {
        await this.connection.close();
        this.logger.log('RabbitMQ connection closed');
      } catch (exception) {
        this.logger.error(`Error while closing connection: ${exception}`);
      }
      this.connection = null;
    }
  }
}
