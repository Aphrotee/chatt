import moment from 'moment/moment.js';
import mongoose from 'mongoose';
import Messages from '../models/Messages.js';
import Users from '../models/Users.js';
import MessageContainers from '../models/MessageContainers.js';


class MessageController{

  newMessage(req, res) {
    const {
      message,
      type,
      timestamp,
      receiverId,
      containerId
    } = req.body;
    const senderId = new mongoose.Types.ObjectId(req.userPayload._id);
    const username = req.userPayload.username;
    const valid_types = ['text', 'image'];

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
      Users.findById(new mongoose.Types.ObjectId(senderId))
        .then((sender) => {
          if (sender) {
            Users.findById(new mongoose.Types.ObjectId(receiverId))
              .then((receiver) => {
                if (receiver) {
                  MessageContainers.findById(new mongoose.Types.ObjectId(containerId))
                    .then((container) => {
                      if (container && container.members.includes(senderId) &&
                      container.members.includes(receiverId) && senderId.toString() !== receiverId.toString()) {
                        const msgTimestamp = moment().format('MMMM Do YYYY-hh:mma');
                        Messages.create({
                          message,
                          type,
                          username,
                          timestamp: msgTimestamp,
                          senderId,
                          receiverId,
                          containerId
                        })
                          .then((sentMessage) => {
                            MessageContainers.findByIdAndUpdate(new mongoose.Types.ObjectId(containerId), {
                              $set: {
                                lastMessage: message,
                                timestamp: msgTimestamp
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
      Messages.find({ containerId })
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