import db from "../utils/db.js";
import redis from "../utils/redis.js";
import Users from "../models/Users.js";
import Messages from "../models/Messages.js";
import MessageContainers from "../models/MessageContainers.js";

/**
 * @swagger
 * tags:
 *   - name: auth
 *     description: Everything about authentication
 *   - name: users
 *     description: Everything about users
 *   - name: messages
 *     description: Everything about messages
 *   - name: containers
 *     description: Everything about message containers
 * components:
 *   securitySchemes:
 *     SessionAuth:
 *       type: http
 *       scheme: bearer
 *     ApiKey:
 *       type: apiKey
 *       in: header
 *       name: X-API-Key
 *   schemas:
 *     Status:
 *       type: object
 *       properties:
 *         redis:
 *           type: boolean
 *           description: this shows if the server is connected to the redis cloud
 *           example: true
 *         db:
 *           type: boolean
 *           description: this shows if the server is connected to the mongodb cloud
 *           example: true
 *     Stats:
 *       type: object
 *       properties:
 *         users:
 *           type: int
 *           description: total number of users
 *           example: 53
 *         messagecontainers:
 *           type: int
 *           description: total number of messagecontainers
 *           example: 532
 *         messages:
 *           type: int
 *           description: total number of messages
 *           example: 53
 * paths:
 *   /status:
 *     get:
 *       summary: server health-check
 *       description: this basically checks the connection status of the database engines
 *       responses:
 *         '200':
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Status'
 *   /stats:
 *     get:
 *       summary: statistics check
 *       description: this returns the statistics of stored objects
 *       responses:
 *         '200':
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Stats'
 *       
 */


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
              .then((messageContainers) => {
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