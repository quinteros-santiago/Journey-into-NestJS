import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserAvatarModule } from './avatar/user-avatar.module';
import { RabbitMQModule } from '../jobs/rabbitmq/rabbitmq.module';
import { MailModule } from '../jobs/mail/mail.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User, UserSchema } from './user.schema';
import { ReqResApiModule } from 'src/apis/req-res/req-res-api.module';
import { UserRepository } from './user.repository';

@Module({
  imports: [
    UserAvatarModule,
    RabbitMQModule,
    MailModule,
    ReqResApiModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UserController],
  providers: [UserService, UserRepository],
})
export class UserModule {}
