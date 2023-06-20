import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { UserAvatarUtil } from './user-avatar.util';
import { ReqResApiService } from '../../apis/req-res/req-res-api.service';
import { UserAvatarRepository } from './user-avatar.repository';

@Injectable()
export class UserAvatarService {
  private readonly logger = new Logger(UserAvatarService.name);

  constructor(
    private readonly userAvatarRepository: UserAvatarRepository,
    private readonly reqResApiService: ReqResApiService,
  ) {}

  async getAvatar(userId: number): Promise<string> {
    if (UserAvatarUtil.avatarExistsLocally(userId)) {
      const base64Avatar = UserAvatarUtil.readAvatarLocally(userId);
      return base64Avatar;
    }

    const reqResUser = await this.reqResApiService.getUser(userId);
    const hexAvatarBuffer = await this.reqResApiService.getAvatar(
      reqResUser.avatar,
    );

    UserAvatarUtil.writeAvatar(userId, hexAvatarBuffer);
    this.logger.debug('Avatar saved locally sucessfully');

    const userAvatar = UserAvatarUtil.mapUserAvatarfromProperties(
      userId,
      UserAvatarUtil.createHash(hexAvatarBuffer),
    );

    if (!(await this.userAvatarRepository.existsByID(userId))) {
      await this.userAvatarRepository.create(userAvatar);
      this.logger.debug('Avatar created on mongodb sucessfully');
    }

    const base64Avatar = UserAvatarUtil.parseAvatarToBase64(hexAvatarBuffer);
    return base64Avatar;
  }

  async deleteAvatar(userId: number): Promise<void> {
    if (!(await this.userAvatarRepository.existsByID(userId))) {
      throw new NotFoundException('Avatar does not exist on mongodb', {
        description: 'Not Found',
      });
    }

    await this.userAvatarRepository.deleteById(userId);
    this.logger.debug('Avatar deleted from mongodb sucessfully');

    if (UserAvatarUtil.avatarExistsLocally(userId)) {
      UserAvatarUtil.deleteAvatarLocally(userId);
      this.logger.debug('Avatar deleted locally sucessfully');
    }
  }
}
