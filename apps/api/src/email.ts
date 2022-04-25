import nodemailer from "nodemailer";
import { EMAIL_PSWD, EMAIL_USER } from "./consts/email";

const transporter = nodemailer.createTransport(
  {
    service: "gmail",
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PSWD,
    },
  },
  { from: EMAIL_USER }
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
