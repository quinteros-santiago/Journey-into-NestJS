import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ReqResUserDto } from '../apis/req-res/dtos/req-res-user.dto';
import { User } from './user.schema';
import { RabbitMQService } from '../jobs/rabbitmq/rabbitmq.service';
import { MailService } from '../jobs/mail/mail.service';
import { ReqResApiService } from 'src/apis/req-res/req-res-api.service';
import { UserUtil } from './user.util';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    private readonly userRespository: UserRepository,
    private readonly rabbitMQService: RabbitMQService,
    private readonly mailService: MailService,
    private readonly reqResApiService: ReqResApiService,
  ) {}

  async createUsers(): Promise<User[]> {
    const reqResUsers = await this.getUsersFromReqResAPI();

    const users = UserUtil.mapUsersFromReqResUserDtos(reqResUsers);

    const createdUsers = await this.userRespository.createMany(users);
    this.logger.debug('Users created on mongodb sucessfully');

    this.mailService.sendEmails(createdUsers);
    this.rabbitMQService.sendEvents(createdUsers);

    return createdUsers;
  }

  private async getUsersFromReqResAPI(): Promise<ReqResUserDto[]> {
    const reqResUsers = (
      await Promise.all([
        this.reqResApiService.getUsersPageable(1),
        this.reqResApiService.getUsersPageable(2),
      ])
    ).flat();

    return reqResUsers;
  }

  async getUser(userId: number): Promise<User> {
    const reqResUser = await this.reqResApiService.getUser(userId);

    const user = UserUtil.mapUserfromReqResUserDto(reqResUser);
    return user;
  }

  async deleteUsers(): Promise<void> {
    if (await this.userRespository.isCollectionEmpty()) {
      throw new NotFoundException(
        'None users were found on mongodb. "users" collection is already empty',
        {
          description: 'Not Found',
        },
      );
    }
    await this.userRespository.deleteAll();
    this.logger.debug('Mongodb "users" collection purged sucessfully');
  }
}
