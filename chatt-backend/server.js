// imports
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
dotenv.config();
import db from './utils/db.js';
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
app.use(express.json());
app.use(morgan('dev'));
app.use(cors());
app.use(cookieParser());

//Connect DB
db.connectDB();

// api routes

app.get('/', appController.home);

app.get('/api/v1/status', appController.status);

app.get('/api/v1/stats', appController.stats);

app.post('/api/v1/auth/register', userController.register);

app.get('/api/v1/auth/login', extractCredentials, authController.login);

app.delete('/api/v1/auth/logout', verifyToken, authController.logout);

app.get('/api/v1/users/me', verifyToken, userController.userProfile);

app.get('/api/v1/users/all', verifyApiKey, userController.allUsers);

app.post('/api/v1/messages/new', verifyToken, messageController.newMessage);

app.param('containerId', (req, res, next, value) => { req.containerId = value; next(); });

app.get('/api/v1/messages/:containerId/all', verifyToken, messageController.allMessages);

app.get('/api/v1/container', verifyToken, messageContainerController.getContainer);

app.get('/api/v1/containers/:containerId', verifyToken, messageContainerController.getContainerById);

app.get('/api/v1/containers/all', verifyToken, messageContainerController.allContainers);


// listener
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
