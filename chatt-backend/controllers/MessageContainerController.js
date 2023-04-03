import MessageContainers from '../models/MessageContainers.js';
import Users from '../models/Users.js';
import mongoose from 'mongoose';

class MessageContainerController {

  getContainer(req, res) {
    const sender = new mongoose.Types.ObjectId(req.userPayload._id);
    const senderPhoto = req.userPayload.profilePhoto;
    const senderUsername = req.userPayload.username;
    let receiver;

    if (req.receiverId instanceof String) {
      receiver = new mongoose.Types.ObjectId(req.receiverId);
    } else {
      receiver = req.receiverId;
    }

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