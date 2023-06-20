import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserAvatarService } from './user-avatar.service';
import { UserAvatar, AvatarSchema } from './user-avatar.schema';
import { ReqResApiModule } from '../../apis/req-res/req-res-api.module';
import { HttpModule } from '@nestjs/axios';
import { UserAvatarRepository } from './user-avatar.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserAvatar.name, schema: AvatarSchema },
    ]),
    ReqResApiModule,
    HttpModule,
  ],
  controllers: [],
  providers: [UserAvatarService, UserAvatarRepository],
  exports: [UserAvatarService],
})
export class UserAvatarModule {}
