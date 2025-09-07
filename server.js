require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const app = express();
const userRouter = require("./routes/UserRoute");
// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
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
