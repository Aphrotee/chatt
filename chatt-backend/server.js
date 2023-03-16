// importing
import express from 'express';
import mongoose from 'mongoose';
import Messages from './models/Messages.js';
import Users from './models/Users.js';
import Pusher from 'pusher';
import morgan from 'morgan';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt'


// app config
const app = express();
const port = process.env.PORT || 9000;

const pusher = new Pusher({
  appId: "1568391",
  key: "5ac65fc188cfeb946d3c",
  secret: "8021645f0db5c663de9b",
  cluster: "mt1",
  useTLS: true
});


//middleWare
app.use(express.json());
app.use(morgan('dev'));
app.use(cors());


// DB config
const connection_url = 'mongodb+srv://webadmin:1xYesPcUNmN1jRz1@cluster0.jewim2h.mongodb.net/chatt?retryWrites=true&w=majority';
mongoose.connect(connection_url, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('DB connection established');
  const db = mongoose.connection;
  const myCollection = db.collection('messages');
  const changeStream = myCollection.watch();
  changeStream.on('change', (change) => {
    console.log('Change occured:', change);
    if (change.operationType === 'insert') {
      const messageDetails = change.fullDocument;
      pusher.trigger('messages', 'inserted',
      {
        name: messageDetails.name,
        message: messageDetails.message,
        timestamp: messageDetails.timestamp
      });
    } else {
      console.log('Error triggering pusher');
    }
  });
})
.catch((err) => {
  console.log('DB encountered error:', err);
});


// ?????


// api routes
app.get('/', (req, res) => {
  res.status(200).send('Hello world!')
});

app.post('/api/v1/messages/new', (req, res) => {
  const message = req.body;

  Messages.create(message)
  .then((data) => {
    res.status(201).send(data);
  })
  .catch((err) => {
    res.status(500).err;
  });
});

app.get('/api/v1/messages/all', (req, res) => {
  Messages.find()
  .then((data) => {
    res.status(200).send(data);
  })
  .catch((err) => {
    res.status(500).send(err);
  });
});

app.post('/api/v1/auth/register', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username) {
    res.status(400).json({ error: "Missing username" });
  } else if (!email) {
    res.status(400).json({ error: "Missing email" });
  } else if (!password) {
    res.status(400).json({ error: "Missing password" });
  }
  Users.findOne({ email })
  .then((user) => {
    if (user) {
      res.status(400).json({ error: "User with this email exists already" });
    }
  })
  .catch((err) => {
    res.status(500).json({ error: err.toString()});
  });
  Users.findOne({ username })
  .then((user) => {
    if (user) {
      res.status(400).json({ error: "User with this username exists already" });
    }
  })
  .catch((err) => {
    res.status(500).json({ error: err.toString()});
  });
  password = await bcrypt.hash(password, 10);
  Users.create({ username, email, password })
  .then((user) => {
    res.status(201).send(user);
  })
  .catch((err) => {
    res.status(500).json({ error: err.toString() });
  });
});

const extractAuthDetails = (req, res, next) => {
  const token = req.header('X-Token');
  if (!token) {
    res.status(400).json({ error: "Missing Token"})
  }

  let details = token.split(' ');
  if (details.length !== 2) {
    res.status(400).json({ error: "There is an error with the Auth Header"});
  } else {
    details = details[0]
  }
  details = Buffer.from(details, 'base64').toString();
  if (!details.includes(':')) {
    res.status(400).json({ error: "There is an error with the Auth Header" });
  } else {
    details = details.split(':');
    req.email = details[0];
    req.password = details[1];
    next();
  }
}

app.post('/api/v1/auth/login', extractAuthDetails, (req, res) => {
  Users.findOne({ email })
    .then(async (user) => {
      if (Object.keys(user) > 0) {
        if (await bcrypt.compare(password, user.password)) {
          const token = jwt.sign(
            { _id: user._id, email: user.email, username: user.username },
            process.env.JWT_SECRET,
            {
              expiresIn: "1d"
            });
          res.status(200).json({ token });
        } else {
          res.status(401).json({ error: "Wrong password!" });
        }
      } else {
        res.status(404).json({ error: "No user with this email address"});
      }
    })
    .catch((err) => {
      res.status(500).json({ error: err.toString()});
    });
});

const verifyToken = (req, res) => {
  const token = req.header('X-Token');
  if (!token) {
    res.status(403).json({ error: "Missing token" });
  } else {
    const isVerified = jwt.verify(token, process.env.JWT_SECRET);
    if (isVerified) {
      next();
    } else {
      res.status(401);
    }
  }
}

app.get('/api/v1/auth/logout', (req, res) => {

})

// listener
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
