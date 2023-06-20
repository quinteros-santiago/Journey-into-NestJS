import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserAvatar } from './user-avatar.schema';

@Injectable()
export class UserAvatarRepository {
  private readonly logger = new Logger(UserAvatar.name);

  constructor(
    @InjectModel(UserAvatar.name)
    private readonly userAvatarModel: Model<UserAvatar>,
  ) {}

  async create(userAvatar: UserAvatar): Promise<UserAvatar> {
    let createdAvatar: UserAvatar;

    try {
      createdAvatar = await this.userAvatarModel.create(userAvatar);
    } catch (exception) {
      this.logger.error(`Unexpected error when creating avatar. ${exception}`);
    }
    return createdAvatar;
  }

  async existsByID(userId: number): Promise<boolean> {
    let documents: number;
    try {
      documents = await this.userAvatarModel
        .countDocuments({ userId: userId })
        .exec();
    } catch (exception) {
      this.logger.error(
        `Unexpected error when searching for avatars existence. ${exception}`,
      );
      throw new InternalServerErrorException(
        'There was a problem when searching avatar on MongoDB',
        {
          description: 'Internal Server Error',
        },
      );
    }

    return documents > 0;
  }

  async deleteById(userId: number) {
    try {
      await this.userAvatarModel.deleteOne({ userId: userId });
    } catch (exception) {
      this.logger.error(`Unexpected error when deleting avatar. ${exception}`);
      throw new InternalServerErrorException(
        'There was a problem when deleting avatar from mongodb',
        {
          description: 'Internal Sever Error',
        },
      );
    }
    return 1;
  }
}
