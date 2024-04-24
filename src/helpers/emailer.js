import nodemailer from "nodemailer";
import dotenv from "dotenv";

export const transporter = nodemailer.createTransport({
  service: "Gmail", // Use the appropriate email service provider
  auth: {
    user: process.env.GMAIL_EMAIL,
    pass: process.env.GMAIL_PASSWORD,
  },
});


export const sendEmail = (to, subject, text, html) => {
  return new Promise((resolve, reject) => {
    const mailOptions = {
      from: process.env.GMAIL_EMAIL,
      to: to,
      subject: subject,
      text: text,
      html: html,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        reject(error);
      } else {
        console.log("Email sent:", info.response);
        resolve(info.response);
      }
    });
  });
};
