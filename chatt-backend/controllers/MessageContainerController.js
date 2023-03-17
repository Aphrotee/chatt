import MessageContainers from '../models/MessageContainer.js';
import mongoose from 'mongoose';

class MessageContainerController {
  getContainer(req, res, next) {
    const sender = mongoose.Types.ObjectId(req.userPayload._id);
    const receiver = mongoose.Types.ObjectId(req.body.receiverId);
    MessageContainers.findOne({ members: { $all: [sender, receiver] } })
    .then((data) => {
      if (Object.keys(data).length > 0) {
        res.status(200).json(data);
        next();
      } else {
        MessageContainers.create({
          members: [sender, receiver],
          numberOfMessages: 0,
          lastMessage: '',
          timestamp: ''
        })
        .then((data) => {
          res.cookie('X-Token', req.token);
          res.status(201).json(data);
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
}


const messageContainerController = new MessageContainerController();
export default messageContainerController;