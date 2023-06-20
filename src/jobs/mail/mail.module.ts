import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailConnectionService } from './mail.connection.service';

@Module({
  imports: [],
  controllers: [],
  providers: [MailService, MailConnectionService],
  exports: [MailService],
})
export class MailModule {}
