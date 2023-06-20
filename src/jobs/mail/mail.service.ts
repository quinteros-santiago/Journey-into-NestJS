import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { User } from '../../user/user.schema';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailConnectionService } from './mail.connection.service';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private readonly gmail: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly mailConnectionService: MailConnectionService,
  ) {
    this.gmail = this.configService.get<string>('GMAIL_EMAIL');
  }

  async sendEmails(users: User[]): Promise<void> {
    for await (const user of users) {
      await this.sendEmail(user);
    }
  }

  private async sendEmail(user: User): Promise<void> {
    const mailOptions: nodemailer.SendMailOptions = {
      from: this.gmail,
      to: user.email,
      subject: 'Welcome to our app',
      text: `Hello ${user.firstName} ${user.lastName},\n\nWelcome to our app!`,
    };

    const transporter = this.mailConnectionService.getTransporter();

    if (transporter) {
      try {
        const message = transporter.sendMail(mailOptions);
        this.logger.debug(`Email sent, message: ${message}`);
      } catch (exception) {
        this.logger.error(`Error while sending email: ${exception}`);
      }
    }
  }
}
