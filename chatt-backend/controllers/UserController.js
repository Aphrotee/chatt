import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import Users from '../models/Users.js';
import worker from '../worker.js';


class UserController {

  async register(req, res) {
    const { username, email, password } = req.body;

    if (!username) {
      res.status(400).json({ error: "Missing username" });
    } else if (!email) {
      res.status(400).json({ error: "Missing email" });
    } else if (!password) {
      res.status(400).json({ error: "Missing password" });
    } else {
      Users.findOne({ email })
        .then((user) => {
          if (user) {
            res.status(400).json({ error: "User with this email exists already" });
          } else {
            Users.findOne({ username })
              .then(async (user) => {
                if (user) {
                  res.status(400).json({ error: "User with this username exists already" });
                } else {
                  const hashedPassword = await bcrypt.hash(password, 10);
                  const quote = 'Hi!, lets connect on Chatt Instant Messaging';
                  Users.create({ username, email, password: hashedPassword, quote })
                    .then((user) => {
                      const response = {
                        id: user._id,
                        username: user.username,
                        email: user.email,
                        quote: user.quote
                       };
                      worker.welcomeNewUser.add({ email: user.email, username: user.username });
                      res.status(201).json(response);
                    })
                    .catch((err) => {
                      res.status(500).json({ error: err.toString() });
                    });
                }
              })
              .catch((err) => {
                res.status(500).json({ error: err.toString()});
              });
          }
        })
        .catch((err) => {
          res.status(500).json({ error: err.toString() });
        });
    }
  }

  userProfile(req, res) {
    const userId = new mongoose.Types.ObjectId(req.userPayload._id);
    const email = req.userPayload.email;
    Users.findOne({ _id: userId, email: email })
      .then((user) => {
        const response = {id: user._id, username: user.username , email }
        res.status(200).send(response);
      })
      .catch((err) => {
        res.status(500).send({ error: err.toString() });
      });
  }

  updateStatus(req, res) {
    const { userId, quote } = req.body;

    if (!userId) {
      res.status(400).json({ error: "Missing user Id" });
    } else if (!quote) {
      res.status(400).json({ error: "Missing status quote" });
    } else {
      Users.findById(new mongoose.Types.ObjectId(userId))
        .then(async (user) => {
          if (user) {
            Users.findByIdAndUpdate(new mongoose.Types.ObjectId(user._id), {
              $set: { quote }
            })
              .then((updated) => {
                res.status(200).json({ message: "status quote updated" });
              })
              .catch((err) => {
                res.status(500).json({ eror: err.toString() });
              });
          }
        })
        .catch((err) => {
          res.status(500).json({ eror: err.toString() });
        });
    }
  }

  allUsers(req, res) {
    Users.aggregate([
      { $match: { } },
      { $set: { id: '$_id' }},
      { $project: { _id: 0, password: 0 }}
    ])
      .then((data) => {
        res.status(200).send(data);
      })
      .catch((err) => {
        res.status(500).json({ error: err.toString() });
      })
  }

}


const userController = new UserController();
export default userController;