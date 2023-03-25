import Bull from 'bull';
import mailer from './utils/mailer.js';


const welcomeNewUser = Bull('Welcome new user');
console.log('Worker up!');

welcomeNewUser.process((job, done) => {
  if (job.data.email === undefined) {
    done("No user email found");
  } else if (job.data.username === undefined) {
    done("No username found");
  } else {
    const username = job.data.username;
    const subject = "Welcome to Chatt Instant Messaging";
    const message = `Dear ${username},\n\nYou have successfully created a Chatt Instant Messaging\
 account.\nWe are more than happy to welcome you to use Chatt to send messages to your friends,\
 colleauges and loved ones.\n\nRegards,\nChatt Instant Messaging Team`;
    mailer(job.data.email, subject, message);
    done();
  }
});

const sendOtpEmail = Bull('Send otp for password reset');

sendOtpEmail.process((job, done) => {
  if (job.data.email === undefined) {
    done("No user email found");
  } else if (job.data.username === undefined) {
    done("No username found");
  } else if (job.data.otp === undefined) {
    done("No otp found");
  } else if (job.data.expireBy === undefined) {
    done("No expiry timestamp found found");
  } else {
    const username = job.data.username;
    const subject = "Password Reset";
    const expireBy = job.data.expireBy;
    const otp = job.data.otp;
    const message = `Dear ${username},\n\nYou have requested for a password reset, the OTP for
 reseting your password is <strong>${otp}</strong>. This otp will expire by ${expireBy}.
\nIf this wasn't you, please discard this email.
\n\nRegards,\nChatt Instant Messaging Team`;
    mailer(job.data.email, subject, message);
    done();
  }
});

export default { welcomeNewUser, sendOtpEmail };