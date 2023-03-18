import mongoose from 'mongoose';
import Messages from '../models/Messages.js';

class MessageController{

  newMessage(req, res) {
    const message = req.body;
  
    Messages.create(message)
    .then((data) => {
      req.cookie('X-Token', req.token);
      res.status(201).json(data);
    })
    .catch((err) => {
      res.status(500).json({ error: err.toString() });
    });
  }

  allMessages(req, res) {
    const containerId = mongoose.Types.ObjectId(req.containerId);

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