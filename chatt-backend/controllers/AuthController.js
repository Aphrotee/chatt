import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import redis from '../utils/redis.js'
import users from '../models/Users.js';


class AuthController {


 login(req, res) {
    const email = req.body.email
    const password = req.body.password;
    users.findOne({ email })
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
              console.log(token)
            res.cookie('X-Token', token);
            return res.status(200).json({ token });
          } else {
            res.status(401).json({ error: "Wrong password!" });
          }
       } else {
          res.status(404).json({ error: "No user with this email address"  });
        }
      })
      .catch((err) => {
        res.status(500).json({ error: err.toString() });
      }
    );
  }

  logout(req, res) {
    redis.set(req.token, 0, 60 * 60 * 24 * 7);
    res.cookie('X-Token', '');
  };

}


const authController = new AuthController();
export default authController;