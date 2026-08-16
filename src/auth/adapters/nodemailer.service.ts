import nodemailer from 'nodemailer';
import { EMAIL_USER, EMAIL_PASS, EMAIL_FROM } from '../../settings/config';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

export const nodemailerService = {
  async sendEmail(
    email: string,
    code: string,
    template: (code: string) => string,
  ): Promise<void> {
    await transporter.sendMail({
      from: EMAIL_FROM,
      to: email,
      subject: 'Registration confirmation',
      html: template(code),
    });
  },
};