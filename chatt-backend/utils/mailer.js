import nodemailer from 'nodemailer';
import sendGrid from '@sendgrid/mail';

const mailer = async (email, subject, body) => {
  // const transporter = nodemailer.createTransport({
  //   service: 'gmail',
  //   auth: {
  //     user: 'web.chattmessaging@gmail.com',
  //     pass: 'iplptuaoprqkyjkr'
  //   }
  // });

  sendGrid.setApiKey(process.env.SENDGRID_API_KEY)
  const message = {
    to: email,
    from: 'web.chattmessaging@gmail.com',
    subject: subject,
    html: body,
  }
  await sendGrid.send(message, (error, result) => {
    if (error) {
      console.log(error);
     } else {
      console.error('Email sent!', result);
     }
  });

  // const mailOptions = {
  //   from: 'Chatt Instant Messaging',
  //   to: email,
  //   subject: subject,
  //   text: body
  // };

  // new Promise((resolve, reject) => {
  //   transporter.verify((error, success) => {
  //     if (error) {
  //       reject(error);
  //     } else {
  //       resolve(success);
  //     }
  //   });
  // })
  //   .then(() => {
  //     console.log('Nodemailer Conection Established');
  //   })
  //   .catch((err) => {
  //     console.llog('Error connecting to Nodemailer:', err);
  //   });

  // new Promise((resolve, reject) => {
  //     transporter.sendMail(mailOptions, (error, info) => {
  //       if (error) {
  //         reject(error);
  //       } else {
  //         resolve(info.response);
  //       }
  //     });
  // })
  //   .then((response) => {
  //     console.log('Email sent:' + response);
  //   })
  //   .catch((err) => {
  //     console.log(error);
  //   });
}

export default mailer;