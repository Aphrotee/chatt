// imports
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
dotenv.config();
import db from './utils/db.js';
import socketIO from './utils/socketio.cjs';
import extractCredentials from './middlewares/extractCredentials.js';
import verifyToken from './middlewares/verifyToken.js';
import verifyApiKey from './middlewares/verifyApiKey.js';
import appController from './controllers/AppController.js';
import userController from './controllers/UserController.js';
import authController from './controllers/AuthController.js';
import messageController from './controllers/MessageController.js';
import messageContainerController from './controllers/MessageContainerController.js';


// app config
const app = express();
const port = process.env.PORT || 9000;

//middlewares
app.use(express.json({ limit: "50mb" }));
app.use(morgan('dev'));
app.use(cors());
app.use(cookieParser());

// api routes

app.get('/', appController.home);

app.get('/api/v1/status', appController.status);

app.get('/api/v1/stats', appController.stats);

app.post('/api/v1/auth/register', userController.register);

app.get('/api/v1/auth/login', extractCredentials, authController.login);

app.post('/api/v1/auth/send-otp', authController.sendOtp);

app.put('/api/v1/auth/reset-password', authController.resetPassword);

app.delete('/api/v1/auth/logout', verifyToken, authController.logout);

app.get('/api/v1/users/me', verifyToken, userController.userProfile);

app.get('/api/v1/users/all', verifyApiKey, userController.allUsers);

app.put('/api/v1/users/update-status-quote', verifyApiKey, userController.updateStatus);

app.post('/api/v1/messages/new', verifyToken, messageController.newMessage);

app.param('containerId', (req, res, next, value) => { req.containerId = value; next();})

app.get('/api/v1/messages/:containerId/all', verifyToken, messageController.allMessages);

app.param('receiverId', (req, res, next, value) => { req.receiverId = value; next(); });

app.get('/api/v1/container/:receiverId', verifyToken, messageContainerController.getContainer);

app.get('/api/v1/containers/all', verifyToken, messageContainerController.allContainers);


// listener
const server = app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

// DB and socket connection and 
db.connectDB(socketIO.socketConnection(server));