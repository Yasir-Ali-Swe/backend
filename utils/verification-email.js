import nodeMailer from "nodemailer";
import { EMAIL, EMAIL_PASSWORD } from "../config/env.js";

export const sendVerificationEmail = async (toEmail, token) => {
  const transporter = nodeMailer.createTransport({
    service: "gmail",
    auth: {
      user: EMAIL,
      pass: EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: EMAIL,
    to: toEmail,
    subject: "Email Verification",
    html: `<p>Please verify your email by clicking the link below:</p>
               <a href="http://localhost:3000/verify-email?token=${token}">Verify Email</a>`,
  };
  await transporter.sendMail(mailOptions);
};
