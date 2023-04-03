// import Bull from 'bull';
import mailer from './utils/mailer.js';


const welcomeNewUser = async (job) => {
  if (job.email === undefined) {
    throw new Error("No user email found");
  } else if (job.username === undefined) {
    throw new Error("No username found");
  } else {
    const username = job.username;
    const subject = "Welcome to Chatt Instant Messaging";
    const message = `Dear ${username},<br><br>You have successfully created a Chatt Instant Messaging\
 account.<br>We are more than happy to welcome you to use Chatt to send messages to your friends,\
 colleauges and loved ones.<br><br>Regards,<br>Chatt Instant Messaging Team`;
    await mailer(job.email, subject, message);
  }
};


const sendOtpEmail = async (job) => {
  if (job.email === undefined) {
    throw new Error("No user email found");
  } else if (job.username === undefined) {
    throw new Error("No username found");
  } else if (job.otp === undefined) {
    throw new Error("No otp found");
  } else if (job.expireBy === undefined) {
    throw new Error("No expiry timestamp found found");
  } else {
    const username = job.username;
    const subject = "Password Reset";
    const expireBy = job.expireBy;
    const otp = job.otp;
    const message = `Dear ${username},<br><br>You have requested for a password reset, the OTP for
 reseting your password is <strong>${otp}</strong>. This otp will expire by ${expireBy}.
 <br>If this wasn't you, please discard this email.
<br><br>Regards,<br>Chatt Instant Messaging Team`;
    await mailer(job.email, subject, message);
  }
};

export default { welcomeNewUser, sendOtpEmail };