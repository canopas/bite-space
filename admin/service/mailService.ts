"use server";

import nodemailer from "nodemailer";

export async function sendMail(subject: any, toEmail: any, html: any) {
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.NEXT_PUBLIC_NODEMAILER_EMAIL,
      pass: process.env.NEXT_PUBLIC_NODEMAILER_PW,
    },
  });

  var mailOptions = {
    from: process.env.NEXT_PUBLIC_NODEMAILER_EMAIL,
    to: toEmail,
    subject: subject,
    // text: otpText,
    html: html,
  };

  transporter.sendMail(mailOptions, function (error: any, info: any) {
    if (error) {
      throw new Error(error);
    } else {
      console.log("Email Sent");
      return true;
    }
  });
}
