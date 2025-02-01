import { MailerService } from '@modules/mailer/mailer.service';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Config } from '@shared/config';
import { MailData } from './types';
import path from 'path';
import ms, { StringValue } from 'ms';

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
      'modules/mail/templates/signup-confirmation.template.hbs'
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

  async sendResetPasswordConfirmation(
    mailData: MailData<{ hash: string; expiresIn: StringValue }>
  ) {
    const url = new URL(
      '/password-reset',
      this.configService.getOrThrow('app.frontendDomain', { infer: true })
    );
    url.searchParams.set('hash', mailData.data.hash);
    url.searchParams.set(
      'expires',
      (Date.now() + ms(mailData.data.expiresIn)).toString()
    );

    const templatePath = path.resolve(
      __dirname,
      'modules/mail/templates/reset-password-confirmation.template.hbs'
    );

    await this.mailerService.send({
      to: mailData.to,
      subject: 'Password reset',
      text: url.toString(),
      templatePath,
      context: {
        title: 'Password reset',
        url: url.toString(),
        action: 'Reset',
      },
    });
  }
}
