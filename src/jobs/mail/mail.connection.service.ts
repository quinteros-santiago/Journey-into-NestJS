import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailConnectionService {
  private readonly logger = new Logger(MailConnectionService.name);

  private readonly transporter: nodemailer.Transporter;
  private readonly gmail: string;
  private readonly password: string;

  constructor(private readonly configService: ConfigService) {
    this.gmail = this.configService.get<string>('GMAIL_EMAIL');
    this.password = this.configService.get<string>('GMAIL_PASSWORD');
    this.transporter = this.createTransporter(this.gmail, this.password);
  }

  private createTransporter(gmail: string, password: string) {
    const validGmailRegex = /^[a-z0-9](\.?[a-z0-9]){5,}@g(oogle)?mail\.com$/;

    if (!validGmailRegex.test(gmail)) {
      this.logger.debug(
        'Gmail adress could not be detected. If you want the API to send emails, please provide a google email address.',
      );
      return null;
    }

    if (!gmail || !password) {
      this.logger.debug(
        'Gmail adress or password was not provided. If you want the API to send emails, please provide a google email address.',
      );
      return null;
    }

    return nodemailer.createTransport({
      service: 'gmail',
      auth: { user: gmail, pass: password },
    });
  }

  getTransporter(): nodemailer.Transporter {
    return this.transporter;
  }
}
