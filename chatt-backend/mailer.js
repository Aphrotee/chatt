// using Twilio SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs

import sGrid from '@sendgrid/mail';
import dotenv from 'dotenv';

dotenv.config();
sGrid.setApiKey(process.env.SENDGRID_API_KEY)
const username = 'Aphrotee';
const otp = 123456;
const expireBy = '1pm';
const msg = {
  to: 'aphrotemitope37@gmail.com', // Change to your recipient
  from: 'web.chattmessaging@gmail.com', // Change to your verified sender
  subject: 'Sending with SendGrid is Fun',
  html:`Dear ${username},<br><br>You have requested for a password reset, the OTP for
  reseting your password is <strong>${otp}</strong>. This otp will expire by ${expireBy}.
  <br>If this wasn't you, please discard this email.
  <br><br><br>Regards,<br>Chatt Instant Messaging Team`
}
sGrid.send(msg)
  .then(() => {
    console.log('Email sent')
  })
  .catch((error) => {
    console.error(error)
  });