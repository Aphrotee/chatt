import MessageContainers from '../models/MessageContainers.js';
import Users from '../models/Users.js';
import mongoose from 'mongoose';

/**
 * @swagger
 * components:
 *   schemas:
 *     MessageContainer:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the message
 *         lastMessage:
 *           type: string
 *           description: last message stored in the container
 *           example: Hello! My name is Temitope
 *         numberOfMessages:
 *           type: int
 *           description: The total number of messages stored in the container
 *           example: text
 *         members:
 *           type: Array
 *           description: This is an array of the unique ids of the users with access to the message container
 *         membersUsernames:
 *           type: Array
 *           description: This is an array of the usernames of the users with access to the message container
 *         membersProfilePhotos:
 *           type: Array
 *           description: This is an array of cloudinary links storing the profile photos of the users with access to the message container
 *         timestamp:
 *           type: object
 *           description: The timestamp object of the last stored message with fields `date` and `time` 
 *         milliTimestamp:
 *           type: int
 *           description: The timestamp in milliseconds of the last stored message. Useful for arranging containers in order
 *           example: 172991097239
 *     MessageContainers:
 *       type: array
 *       items:
 *         $ref: '#/components/schemas/MessageContainer'
 * paths:
 *   /container/{receiverId}:
 *     get:
 *       parameters:
 *       - name: X-Token
 *         in: header
 *         required: true
 *         type: string
 *         description: carries the jwt token for authentication
 *       - name: receiverId
 *         in: path
 *         description: carries the id of the receiver that would own with the logged in user, the message container to be retrieved
 *         required: true
 *         schema:
 *           type: string
 *       tags:
 *         - containers
 *       summary: retrieves aa particular message container for a conversation between two users
 *       security:
 *         - SessionAuth: []
 *       responses:
 *         '200':
 *           summary: an existing container has been found and retrieved
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/MessageContainer'
 *         '201':
 *           summary: an existing container has been created and retrieved
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/MessageContainer'
 *   /containers/all:
 *     get:
 *       parameters:
 *       - name: X-Token
 *         in: header
 *         required: true
 *         type: string
 *         description: carries the jwt token for authentication
 *       tags:
 *         - containers
 *       summary: retrieves all containers
 *       security:
 *         - SessionAuth: []
 *       responses:
 *         '200':
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/MessageContainers'
 */

class MessageContainerController {

  getContainer(req, res) {
    const sender = new mongoose.Types.ObjectId(req.userPayload._id);
    const receiver = new mongoose.Types.ObjectId(req.receiverId);
    const senderPhoto = req.userPayload.profilePhoto;
    const senderUsername = req.userPayload.username;

    // if (req.receiverId instanceof String) {
    //   receiver = new mongoose.Types.ObjectId(req.receiverId);
    // } else {
    //   receiver = req.receiverId;
    // }
    MessageContainers.aggregate([
      { $match: { members: { $all: [sender, receiver] } } }
    ])
      .then((data) => {
        if (data.length > 0) {
          res.status(200).json(data[0]);
        } else {
          Users.findById(receiver)
            .then((Receiver) => {
              MessageContainers.create({
                members: [sender, receiver],
                membersUsernames: [senderUsername, Receiver.username],
                membersPhotos: [senderPhoto, Receiver.profilePhoto],
                numberOfMessages: 0,
                lastMessage: '',
                timestamp: {},
                milliTimestamp: 0
              })
              .then((data) => {
                res.cookie('X-Token', req.token);
                res.status(201).json(data);
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
        res.status(500).json({ error: err.toString() });
      });
  }

  allContainers(req, res) {
    const sender = new mongoose.Types.ObjectId(req.userPayload._id);

    MessageContainers.aggregate([
      { $match: { members: { $all: [sender] }, numberOfMessages: { $gt: 0 } } },
      { $sort: { milliTimestamp: -1 } }
    ])
      .then((data) => {
        res.status(200).send(data);
      })
      .catch((err) => {
        res.status(500).json({ error: err.toString() });
      });
  }

  getContainerById(req, res) {
    const id = new mongoose.Types.ObjectId(req.containerId.toString());

    MessageContainers.findById(id)
      .then((data) => {
        if (data) {
          res.status(200).json(data);
        } else {
          res.status(404).json({ error: "Container not found" });
        }
      })
      .catch((err) => {
        res.status(500).json({ error: err.toString() });
      });
  }
}


const messageContainerController = new MessageContainerController();
export default messageContainerController;