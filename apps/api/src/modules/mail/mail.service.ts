import { MailerService } from '@modules/mailer/mailer.service';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Config } from '@shared/config';
import { MailData } from './types';
import path from 'path';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService<Config>
  ) {}

  async sendSignUpConfirmation(mailData: MailData<{ hash: string }>) {
    const url = new URL(
      '/confirm',
      this.configService.getOrThrow('app.frontendDomain', { infer: true })
    );
    url.searchParams.set('hash', mailData.data.hash);

    const templatePath = path.resolve(
      __dirname,
      'templates',
      'signup-confirmation.template.hbs'
    );

    await this.mailerService.send({
      to: mailData.to,
      subject: 'Sign up confirmation',
      text: url.toString(),
      templatePath,
      context: {
      title: 'Sign up confirmation',
      url: url.toString(),
      action: 'Confirm',
      },
    });
  }
}
