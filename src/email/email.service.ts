import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { envs } from '../config/envs';

export interface SendMailOptions {
  to: string;
  subject: string;
  html: string;
}

@Injectable()
export class EmailService {
  private transporter = nodemailer.createTransport({
    service: envs.MAILER_SERVICE,
    auth: {
      user: envs.MAILER_EMAIL,
      pass: envs.MAILER_SECRET_KEY,
    },
  });

  async sendMail(options: SendMailOptions): Promise<boolean> {
    try {
      const { to, subject, html } = options;

      await this.transporter.sendMail({
        from: envs.MAILER_EMAIL,
        to,
        subject,
        html,
      });

      return true;
    } catch (error) {
      console.error('Error sending email:', error);
      return false;
    }
  }
}