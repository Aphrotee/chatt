import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import Users from '../models/Users.js';
import MessageContainers from '../models/MessageContainers.js';
import worker from '../worker.js';

/**
 * @swagger
 * components:
 *   schemas:
 *     Users:
 *       type: object
 *       required:
 *         - email
 *         - username
 *         - password
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the user
 *         username:
 *           type: string
 *           description: The unique name of the user
 *           example: Temitope
 *         email:
 *           type: string
 *           description: The valid email of the user
 *           example: temitopeaiyebogan@gmail.com
 *         password:
 *           type: string
 *           description: The encrypted password of the user
 *         quote:
 *           type: string
 *           description: The user profile's status quote
 *           example: Hi!, lets connect on Chatt Instant Messaging
 *         profilePhoto:
 *           type: string
 *           description: The cloudinary-generated url routing to the profile photo of the user stored in the remotely
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the user
 *         username:
 *           type: string
 *           description: The unique name of the user
 *           example: Temitope
 *         email:
 *           type: string
 *           description: The valid email of the user
 *           example: temitopeaiyebogan@gmail.com
 *         quote:
 *           type: string
 *           description: The user profile's status quote
 *           example: Hi!, lets connect on Chatt Instant Messaging
 *         profilePhoto:
 *           type: string
 *           description: The cloudinary-generated url routing to the profile photo of the user stored in the remotely
 *     users:
 *       type: array
 *       items:
 *         $ref: '#/components/schemas/User'
 *     Username:
 *       type: object
 *       properties:
 *         username:
 *           type: string
 *           description: The unique name of the user
 *     Bio:
 *       type: object
 *       properties:
 *         quote:
 *           type: string
 *           description: The status bio of the user
 *     ProfilePhoto:
 *       type: object
 *       properties:
 *         profilephoto:
 *           type: string
 *           description: The clodinary url of the profilephoto of the user
 * paths:
 *   /users/me:
 *     get:
 *       parameters:
 *       - name: X-Token
 *         in: header
 *         required: true
 *         type: string
 *         description: carries the jwt authentication token
 *       tags:
 *         - users
 *       summary: retrieves the profile of the current user
 *       security:
 *         - SessionAuth: []
 *       responses:
 *         '200':
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/User'
 *   /users/all:
 *     get:
 *       parameters:
 *       - name: X-API-Key
 *         in: header
 *         required: true
 *         type: string
 *         description: carries the API key that can be used to authenticate without being logged in
 *       tags:
 *         - users
 *       summary: retrieves all users
 *       security:
 *         - ApiKey: []
 *       responses:
 *         '200':
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/users'
 *   /users/update-username:
 *     put:
 *       parameters:
 *       - name: X-Token
 *         in: header
 *         required: true
 *         type: string
 *         description: carries the jwt authentication token
 *       tags:
 *         - users
 *       summary: updates the username of the current user
 *       security:
 *         - SessionAuth: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Username'
 *       responses:
 *         '200':
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/User'
 *         '403': 
 *           description: username taken already
 *   /users/update-bio:
 *     put:
 *       parameters:
 *       - name: X-Token
 *         in: header
 *         required: true
 *         type: string
 *         description: carries the jwt authentication token
 *       tags:
 *         - users
 *       summary: updates the profile bio of the user
 *       security:
 *         - SessionAuth: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Bio'
 *       responses:
 *         '200':
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/User'
 *   /users/update-profile-photo:
 *     put:
 *       parameters:
 *       - name: X-Token
 *         in: header
 *         required: true
 *         type: string
 *         description: carries the jwt authentication token
 *       tags:
 *         - users
 *       summary: updates the profilephoto link of the user
 *       security:
 *         - SessionAuth: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProfilePhoto'
 *       responses:
 *         '200':
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/User'
 */

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