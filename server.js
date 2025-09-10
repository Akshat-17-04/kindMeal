require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const expressSession = require("express-session");
const MongoStore = require("connect-mongo");
const app = express();
const userRouter = require("./routes/UserRoute");
// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  expressSession({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      collectionName: "sessions",
    }),
    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60, // 1 hour
    },
  })
);
//MongoConnection
connectDB();
//surpressingwarnings
process.removeAllListeners("warning");
//assigning routes
app.use("/kindMeal", userRouter);
app.listen(process.env.PORT, (err) => {
  if (!err) console.log(`Server Started at ${process.env.PORT} `);
  else {
    console.log(err.message);
  }
});
