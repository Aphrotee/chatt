// imports
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import path from 'path';
import engines from 'consolidate';
import swaggerJSDoc from "swagger-jsdoc";
import swaggerui from "swagger-ui-express"; 
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

// app.get('/', appController.home);

app.get('/api/v1/status', appController.status);

app.get('/api/v1/stats', appController.stats);

app.post('/api/v1/auth/register', userController.register);

app.get('/api/v1/auth/login', extractCredentials, authController.login);

app.post('/api/v1/auth/send-otp', authController.sendOtp);

app.put('/api/v1/auth/reset-password', authController.resetPassword);

app.delete('/api/v1/auth/logout', verifyToken, authController.logout);

app.get('/api/v1/users/me', verifyToken, userController.userProfile);

app.get('/api/v1/users/all', verifyApiKey, userController.allUsers);

app.put('/api/v1/users/update-bio', verifyToken, userController.updateBio, userController.userProfile);

app.put('/api/v1/users/update-username', verifyToken, userController.updateUsername, userController.userProfile);

app.put('/api/v1/users/update-profile-photo', verifyToken, userController.updateProfilePhoto, userController.userProfile);

app.post('/api/v1/messages/new', verifyToken, messageController.newMessage);

app.param('containerId', (req, res, next, value) => { req.containerId = value; next();})

app.get('/api/v1/messages/:containerId/all', verifyToken, messageController.allMessages);

app.param('receiverId', (req, res, next, value) => { req.receiverId = value; next(); });

app.get('/api/v1/container/:receiverId', verifyToken, messageContainerController.getContainer);

app.get('/api/v1/containers/all', verifyToken, messageContainerController.allContainers);

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Chatt Instant Messaging Api doc",
      version: "1.0.0",
      description: "This a chatt application API for the backend of Chatt Instant Messaging made with Express and\
      documented with Swagger",
      contact: {
        name: "Temitope Aiyebogan",
        email: "temitopeaiyebogan@gmail.com"
      }
    },
    servers: [
      {
        url: "https://chatt.cyclic.app/api/v1/"
      }
    ]
  },
  apis: ["./controllers/*.js"]
};

const spacs = swaggerJSDoc(options);
app.use(
    "/api-doc",
    swaggerui.serve,
    swaggerui.setup(spacs)
)
const __dirname1 = path.resolve();

// if (process.env.NODE_ENV === 'production') {
//   app.use((express.static(path.join(__dirname1, '/chatt-frontend'))));
//   app.set('views', __dirname1 + '/chatt-frontend' + '/dist');
//   app.engine('html', engines.mustache);
//   app.set('view engine', 'html');

//   app.get('*', (req, res) => {
//     res.render(path.resolve(__dirname1, 'chatt-frontend', 'dist', 'index.html'));
//   })
// } else {
//   app.get('/', appController.home);
// }
app.get('/', appController.home);


// listener
const server = app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

// DB and socket connection and 
db.connectDB(socketIO.socketConnection(server));
