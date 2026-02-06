const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

async function sendEmail({ to, subject, body }) {
  const info = await transporter.sendMail({
    from: `"Your Name" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text: body
  });

  return info;
}

module.exports = { sendEmail };
