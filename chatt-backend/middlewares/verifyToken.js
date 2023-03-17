import jwt from 'jsonwebtoken';
import redis from '../utils/redis.js';

const verifyToken = async (req, res, next) => {
  const token = req.header('X-Token');
  if (!token) {
    res.status(403).json({ error: "Missing token" });
  } else {
    const validity = await redis.get(token);
    if (Number(validity)) {
    jwt.verify(token, process.env.JWT_SECRET, (err, userPayload) => {
      if (err) {
        res.status(401).json( { error: err.toString() });
      } else {
        req.userPayload = userPayload;
        req.token = token;
        res.cookie('X-Token', req.token);
        next();
      }
    });
    } else {
      res.status(403).json({ error: "User is logged out, please login" });
    }
  }
}


export default verifyToken;