import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import Users from '../models/Users.js';
import MessageContainers from '../models/MessageContainers.js';
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
                  const profilePhoto = '';
                  Users.create({ username, email, profilePhoto, password: hashedPassword, quote })
                    .then(async (user) => {
                      const response = {
                        id: user._id,
                        username: user.username,
                        email: user.email,
                        quote: user.quote,
                        profilePhoto: user.profilePhoto
                       };
                      await worker.welcomeNewUser({ email: user.email, username: user.username });
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
        const response = {id: user._id, username: user.username , profilePhoto: user.profilePhoto, email: user.email, quote: user.quote }
        res.status(200).send(response);
      })
      .catch((err) => {
        res.status(500).send({ error: err.toString() });
      });
  }

  updateUsername(req, res, next) {
    const userId = new mongoose.Types.ObjectId(req.userPayload._id);
    const { username } = req.body;

    if (!username) {
      res.status(400).json({ error: "Missing status username" });
    } else {
      Users.findById(new mongoose.Types.ObjectId(userId))
        .then(async (user) => {
          Users.find({ username })
            .then((existingUsers) => {
              if (!existingUsers.length) {
                Users.findByIdAndUpdate(new mongoose.Types.ObjectId(user._id), {
                  $set: { username }
                })
                  .then((updated) => {
                    next();
                  })
                  .catch((err) => {
                    res.status(500).json({ eror: err.toString() });
                  });
              } else {
                res.status(403).json({ error: "username taken already" });
              }
            })
        })
        .catch((err) => {
          res.status(500).json({ eror: err.toString() });
        });
    }
  }

  updateBio(req, res, next) {
    const userId = new mongoose.Types.ObjectId(req.userPayload._id);
    const { quote } = req.body;

    if (!quote) {
      res.status(400).json({ error: "Missing status quote" });
    } else {
      Users.findById(new mongoose.Types.ObjectId(userId))
        .then(async (user) => {
          if (user) {
            Users.findByIdAndUpdate(new mongoose.Types.ObjectId(user._id), {
              $set: { quote }
            })
              .then((updated) => {
                next();
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

  updateProfilePhoto(req, res, next) {
    const userId = new mongoose.Types.ObjectId(req.userPayload._id);
    const { profilePhoto } = req.body;

    if (!profilePhoto) {
      res.status(400).json({ error: "Missing profile photo" });
    } else {
      Users.findById(new mongoose.Types.ObjectId(userId))
        .then(async (user) => {
          if (user) {
            const oldPhoto = user.profilePhoto;
            Users.findByIdAndUpdate(new mongoose.Types.ObjectId(user._id), {
              $set: { profilePhoto }
            })
              .then((updated) => {
                MessageContainers.aggregate([
                  { $match: { members: { $all: [userId] } } }
                ])
                  .then((containers) => {
                    if (containers.length) {
                      containers.forEach((container) => {
                        let otherPhoto = [''];
                        if (container.membersPhotos) {
                          otherPhoto = container.membersPhotos.filter((photo) => {
                            if (photo !== oldPhoto) {
                              return true;
                            } else {
                              return false;
                            }
                          });
                        }
                        const newPhotos = [...otherPhoto, profilePhoto];
                        MessageContainers.findByIdAndUpdate(container._id, {
                            $set: { membersPhotos: newPhotos }
                        })
                          .catch((err) => {
                            res.status(500).json({ error: err.toString() });
                          });
                      })
                    }
                    next();
                  })
                  .catch((err) => {
                    res.status(500).json({ error: err.toString() });
                  });
              })
              .catch((err) => {
                res.status(500).json({ error: err.toString() });
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