import MessageContainers from '../models/MessageContainers.js';
import mongoose from 'mongoose';

class MessageContainerController {

  getContainer(req, res) {
    const sender = new mongoose.Types.ObjectId(req.userPayload._id);
    const receiver = new mongoose.Types.ObjectId(req.body.receiverId);
    console.log(sender, receiver);

    MessageContainers.aggregate([
      { $match: { members: { $all: [sender, receiver] } } }
    ])
      .then((data) => {
        if (data.length > 0) {
          res.status(200).json(data[0]);
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
              console.log('create', err);
              res.status(500).json({ error: err.toString() });
            });
        }
      })
      .catch((err) => {
        console.log('find', err);
        res.status(500).json({ error: err.toString() });
      });
  }

  allContainers(req, res) {
    const sender = new mongoose.Types.ObjectId(req.userPayload._id);
    MessageContainers.aggregate([
      { $match: { members: { $all: [sender] }, numberOfMessages: { $gt: 0 } } },
      { $sort: { timestamp: -1 } }
    ])
      .then((data) => {
        res.status(200).send(data);
      })
      .catch((err) => {
        res.status(500).json({ error: err.toString() });
      });
  }

}


const messageContainerController = new MessageContainerController();
export default messageContainerController;