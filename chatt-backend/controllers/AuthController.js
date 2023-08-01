import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import datetime from 'node-datetime';
import redis from '../utils/redis.js'
import Users from '../models/Users.js';
import worker from '../worker.js';

/**
 * @swagger
 * components:
 *   schemas:
 *     userEmail:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           description: user email
 *     userId:
 *       type: object
 *       properties:
 *         userId:
 *           type: string
 *           description: unique id of the user requesting password reset
 *     userLogin:
 *       type: object
 *       properties:
 *         userId:
 *           type: string
 *           description: user's id
 *         username:
 *           type: string
 *           description: username of logged in user
 *         token:
 *           type: string
 *           description: jwt token for authorization
 *     passwordReset:
 *       type: object
 *       properties:
 *         userId:
 *           type: string
 *           description: user's id
 *         otp:
 *           type: string
 *           description: otp to be used to verify user before reseting password
 *         password:
 *           type: string
 *           description: new password to be used
 * paths:
 *   /auth/register:
 *     post:
 *       tags:
 *         - auth
 *       summary: creates a new user
 *       description: creates a new user with username, email and password
 *       requestBody:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Users'
 *         required: true
 *       responses:
 *         '201':
 *           description: user created
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/User'
 *         '400':
 *           description: Missing email or username or password OR email or username already taken by another user
 *   /auth/login:
 *     get:
 *       parameters:
 *       - name: Authorization
 *         in: header
 *         required: true
 *         type: string
 *         description: carries the encrypted email and password
 *       tags:
 *         - auth
 *       summary: logs a user in
 *       description: uses user email and password to login
 *       responses:
 *         '200':
 *           description: login successful
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/userLogin'
 *         '404':
 *           description: No user exists with supplied email
 *         '401':
 *           description: Wrong password
 *   /auth/send-otp:
 *     post:
 *       tags:
 *         - auth
 *       summary: triggers otp to be sent to user email
 *       description: creates and sends otp for password reset to user email
 *       requestBody:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/userEmail'
 *         required: true
 *       responses:
 *         '200':
 *           description: otp sent
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/userId'
 *         '404':
 *           description: No user with supplied email
 *   /auth/reset-password:
 *     put:
 *       tags:
 *         - auth
 *       summary: updates password of user specified by email
 *       description: resets user password with otp verification
 *       requestBody:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/passwordReset'
 *         required: true
 *       responses:
 *         '204':
 *           description: user password reset
 *         '400':
 *           description: Missing otp or userId or new password
 *         '403':
 *           description: Invalid otp or expired otp
 *   /auth/logout:
 *     delete:
 *       parameters:
 *       - name: X-Token
 *         in: header
 *         required: true
 *         type: string
 *         description: carries the jwt authentication token
 *       tags:
 *         - auth
 *       summary: logs out a user
 *       security:
 *         - SessionAuth: []
 *       requestBody:
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *         required: true
 *       responses:
 *         '204':
 *           description: user logged out successfully
 */
 

class AuthController {

 login(req, res) {
    const email = req.email;
    const password = req.password;
    Users.findOne({ email })
      .then(async (user) => {
        if (user) {
          if (await bcrypt.compare(password, user.password)) {
            const token = jwt.sign(
              { _id: user._id.toString(), email: user.email, username: user.username, profilePhoto: user.profilePhoto },
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

  async sendOtp(req, res) {
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
          await worker.sendOtpEmail({ email, username: user.username, otp, expireBy });
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