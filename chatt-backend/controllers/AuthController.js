import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import datetime from 'node-datetime';
import redis from '../utils/redis.js'
import Users from '../models/Users.js';
import worker from '../worker.js';


class AuthController {

 login(req, res) {
    const email = req.email;
    const password = req.password;
    Users.findOne({ email })
      .then(async (user) => {
        if (user) {
          if (await bcrypt.compare(password, user.password)) {
            const token = jwt.sign(
              { _id: user._id.toString(), email: user.email, username: user.username },
              process.env.JWT_SECRET,
              {
                expiresIn: "7d"
              });
            await redis.set(token, 1, 60 * 60 * 24 * 7);
            res.cookie('X-Token', token);
            res.status(200).json({ token, username: user.username, userId: user._id });
          } else {
            res.status(401).json({ error: "Wrong password!" });
          }
       } else {
          res.status(404).json({ error: "No user with this email address" });
        }
      })
      .catch((err) => {
        res.status(500).json({ error: err.toString() });
      }
    );
  }

  sendOtp(req, res) {
    const { email } = req.body;
    const createOtp = (min, max) => {
      return Math.floor(Math.random() * (max - min)) + min;
    }

    Users.findOne({ email })
      .then(async (user) => {
        if (user) {
          const otp = createOtp(100000, 1000000);
          await redis.set(`otp_${user._id}`, otp, 60 * 10);
          const date = datetime.create();
          const dateMilliseconds = date.now();
          const newdate = dateMilliseconds + (60 * 10000);
          const d  = new Date(newdate);
          const expireBy = (datetime.create(d, 'f d, Y H:M p').format());
          worker.sendOtpEmail.add({ email, username: user.username, otp, expireBy })
          res.status(200).json({ userId: user._id });
        } else {
          res.status(400).json({ error: "No user with this email address" });
        }
      })
      .catch((err) => {
        res.status(500).json({ error: err.toString() });
      });
  }

  async resetPassword(req, res) {
    const { userId, otp, password } = req.body;

    if (!userId) {
      res.status(400).json({ error: "Missing user Id" });
    } else if (!otp) {
      res.status(400).json({ error: "Missing otp" });
    } else if (!password) {
      res.status(400).json({ error: "Missing password" });
    } else {
      const storedOtp = await redis.get(`otp_${userId.toString()}`);
      if (otp) {
        if (otp === storedOtp) {
        Users.findById(new mongoose.Types.ObjectId(userId))
             .then(async (user) => {
                 if (user) {
                const hashedPassword = await bcrypt.hash(password, 10);
                Users.findByIdAndUpdate(new mongoose.Types.ObjectId(user._id), {
                  $set: { password: hashedPassword }
                })
                  .then((updated) => {
                    res.status(200).json({ message: "Password reset successful" });
                  })
                  .catch((err) => {
                    res.status(500).json({ eror: err.toString() });
                  });
              }
            })
            .catch((err) => {
              res.status(500).json({ eror: err.toString() });
            });
        } else {
          res.status(403).json({ error: "Invalid otp" });
        }
      } else {
        res.status(403).json({ error: "Otp expired" });
      }
    }
  }

  logout(req, res) {
    redis.set(req.token, 0, 60 * 60 * 24 * 7);
    res.cookie('X-Token', '');
    res.json({message: "successfully logged out"});
  };

}


const authController = new AuthController();
export default authController;