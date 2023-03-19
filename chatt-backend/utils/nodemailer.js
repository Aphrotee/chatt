import nodemailer from 'nodemailer';

const mailer = (email, subject, body) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'web.chattmessaging@gmail.com',
      pass: 'iplptuaoprqkyjkr'
    }
  });

  const mailOptions = {
    from: 'Chatt Instant Messaging',
    to: email,
    subject: subject,
    text: body
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}

export default mailer;