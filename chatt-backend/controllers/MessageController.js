import moment from 'moment/moment.js';
import mongoose, { Mongoose } from 'mongoose';
import Messages from '../models/Messages.js';
import users from '../models/Users.js';
import messagecontainers from '../models/MessageContainers.js';


class MessageController{


  async newMessage(req, res) {
    const {
      message,
      type,
      receiverId,
      containerId
    } = req.body

    const senderId = new mongoose.Types.ObjectId(req.userPayload._id);
    const username = req.userPayload.username;
    const valid_types = ['text', 'image'];
    const ObjectId = mongoose.Types.ObjectId

    if (!message) {
      res.status(400).json({ error: "Missing message body" });
    } else if (!type) {
      res.status(400).json({ error: "Missing message type" });
    } else if (!type || !valid_types.includes(type)) {
      res.status(400).json({ error: "Invalid message type" });
    } else if (!receiverId) {
      res.status(400).json({ error: "Missing receiver id" });
    } else if (!containerId) {
      res.status(400).json({ error: "Missing container id" });
    } else {
      users.findById(new mongoose.Types.ObjectId(senderId))
        .then((sender) => {
          if (sender) {
            users.findById(new mongoose.Types.ObjectId(receiverId))
              .then((receiver) => {
                if (receiver) {
                  messagecontainers.findById(new mongoose.Types.ObjectId(containerId))
                    .then((container) => {
                      if (container && container.members.includes(senderId) &&
                      container.members.includes(new ObjectId(receiverId)) && senderId.toString() !== receiverId) {
                        const msgTimestamp = moment().format('MMMM Do YYYY-hh:mma');
                        const timstampArr = msgTimestamp.split('-');
                        const date = timstampArr[0];
                        const time = timstampArr[1];
                        Messages.create({
                          message,
                          type,
                          username,
                          timestamp: { date, time },
                          milliTimestamp: Date.now(),
                          senderId,
                          receiverId,
                          containerId
                        })
                          .then((sentMessage) => {
                            messagecontainers.findByIdAndUpdate(new mongoose.Types.ObjectId(containerId), {
                              $set: {
                                lastMessage: message,
                                timestamp: { date, time },
                                milliTimestamp: Date.now()
                              },
                              $inc: {
                                numberOfMessages: 1
                              }
                            })
                              .then((updatedContainer) => {
                                res.cookie('X-Token', req.token);
                                res.status(201).json({
                                  sentMessage,
                                  updatedContainer
                                });
                              })
                              .catch((err) => {
                                res.status(500).json({ error: err.toString() });
                              });
                          })
                          .catch((err) => {
                             res.status(500).json({ error: err.toString() });
                          });
                      } else {
                        res.status(404).json({ error: "No container found to hold message" });
                      }
                    })
                    .catch((err) => {
                      res.status(500).json({ error: err.toString() });
                    });
                } else {
                  res.status(404).json({ error: "No user found to receive message" });
                }
              })
              .catch((err) => {
                res.status(500).json({ error: err.toString() });
              });
          } else {
            res.status(404).json({ error: "No user found to send message" });
          }
        })
        .catch((err) => {
          res.status(500).json({ error: err.toString() });
        });
    }
  }

  allMessages(req, res) {
    const containerId = new mongoose.Types.ObjectId(req.containerId);

    if (containerId) {
      Messages.aggregate([
        { $match: { containerId } },
        { $set: { id: '$_id' }},
        { $project: { _id: 0 }},
        { $sort: { milliTimestamp: 1 } }
      ])
        .then((data) => {
          res.cookie('X-Token', req.token);
          res.status(200).send(data);
        })
        .catch((err) => {
          res.status(500).json({ error: err.toString() });
        });
    }
  }
}


const messageController = new MessageController()
export default messageController;