import db from "../utils/db.js";
import redis from "../utils/redis.js";
import Users from "../models/Users.js";
import Messages from "../models/Messages.js";
import MessageContainers from "../models/MessageContainers.js";

class AppController {

  home(req, res) {
    res.status(200).send("Welcome to Chatt Instant Messaging");
  }

  status(req, res) {
    res.status(200).json({
      db: db.isAlive(),
      redis: redis.isAlive()
    });
  }

  stats(req, res) {
    Users.count()
      .then((users) => {
        Messages.count()
          .then((messages) => {
            MessageContainers.count()
              .then(async (messageContainers) => {
                await redis.set('test', 'Ok', 10000);
                res.status(200).json({
                  users,
                  messages,
                  messageContainers
                });
              })
              .catch((err) => {
                res.status(500).json({ error: err.toString() });
              });
          })
          .catch((err) => {
            res.status(500).json({ error: err.toString() });
          });
      })
      .catch((err) => {
        res.status(500).json({ error: err.toString() });
      });
  }

}

const appController = new AppController();
export default appController;