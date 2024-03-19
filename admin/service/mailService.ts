// "use server";

// import nodemailer from "nodemailer";
// import config from "../config";

// export async function sendMail(subject: any, toEmail: any, html: any) {
//   var transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//       user: config.NODEMAILER_EMAIL,
//       pass: config.NODEMAILER_PW,
//     },
//   });

//   var mailOptions = {
//     from: config.NODEMAILER_EMAIL,
//     to: toEmail,
//     subject: subject,
//     // text: otpText,
//     html: html,
//   };

//   transporter.sendMail(mailOptions, function (error: any, info: any) {
//     if (error) {
//       throw new Error(error);
//     } else {
//       console.log("Email Sent");
//       return true;
//     }
//   });
// }
