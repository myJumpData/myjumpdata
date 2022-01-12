import nodemailer from 'nodemailer';
import emailConfig from '../config/email.config';

const transporter = nodemailer.createTransport(
  {
    service: 'gmail',
    auth: {
      user: emailConfig.EMAIL_USER,
      pass: emailConfig.EMAIL_PSWD,
    },
  },
  { from: emailConfig.EMAIL_USER }
);
export default function SendMail({
  to,
  subject,
  text,
  html,
}: {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}): Promise<object> {
  return transporter.sendMail({
    to,
    subject,
    text,
    html,
  });
}
