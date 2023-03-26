import mongoose from 'mongoose'
import Users from './models/Users.js'
import dotenv from 'dotenv';

dotenv.config()



const connectDB = () => {
    const connection_url = process.env.MONGO_URI;
    mongoose.connect(connection_url, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
      .then(() => {
        console.log('DB connection established');
        Users.find({})
          .then((users) => {
            if (users.length) {
                for (let user of users)
                {
                  console.log(user)
                //   Users.findByIdAndUpdate(new mongoose.Types.ObjectId(user._id), {
                //     $set: {
                //       quote: "Hi!, lets connect on Chatt Instant Messaging"
                //     }
                //  })
                //    .then((up) => {
                //       console.log(up);
                //    })
                //    .catch((err) => {
                //      console.log(err);
                //    });
                }
            }
          })
          .catch((err) => {
            console.log(err);
          });
    })
 }

 connectDB()