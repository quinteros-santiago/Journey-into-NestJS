import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.schema';

@Injectable()
export class UserRepository {
  private readonly logger = new Logger(UserRepository.name);

  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async createMany(users: User[]): Promise<User[]> {
    let createdUsers: User[];
    try {
      createdUsers = await this.userModel.create(users);
    } catch (exception) {
      if (exception.code === 11000) {
        throw new ConflictException(
          'Users were already created on mongodb, try removing them with the DELETE /users endpoint',
          {
            description: 'Conflict',
          },
        );
      } else {
        this.logger.error(
          `Unexpected error when inserting users on mongodb. ${exception}`,
        );
        throw new InternalServerErrorException(
          'There was a problem when inserting users on mongodb',
          {
            description: 'Internal Server Error',
          },
        );
      }
    }
    return createdUsers;
  }

  async deleteAll() {
    try {
      await this.userModel.deleteMany().exec();
    } catch (exception) {
      this.logger.error(
        `Unexpected error when deleting users on mongodb. ${exception}`,
      );
      throw new InternalServerErrorException(
        'Mongo "users" collection was not purged',
        {
          description: 'Internal Server Error',
        },
      );
    }
  }

  async isCollectionEmpty(): Promise<boolean> {
    try {
      return 0 === (await this.userModel.countDocuments());
    } catch (exception) {
      this.logger.error(
        `Unexpected error when deleting users on mongodb. ${exception}`,
      );
      throw new InternalServerErrorException(
        'There was a problem when inserting users on mongodb',
        {
          description: 'Internal Server Error',
        },
      );
    }
  }
}
