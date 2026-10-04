import nodemailer from 'nodemailer';

let transporter;

const getTransporter = async () => {
  if (transporter) return transporter;
  const testAccount = await nodemailer.createTestAccount();
  transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });
  return transporter;
};

export const sendEmail = async ({ to, subject, html }) => {
  try {
    const t = await getTransporter();
    const info = await t.sendMail({
      from: '"StayNest" <no-reply@staynest.com>',
      to,
      subject,
      html,
    });
    console.log(`Email sent: ${info.messageId}`);
    console.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
  } catch (err) {
    console.error('Error sending email:', err);
  }
};
