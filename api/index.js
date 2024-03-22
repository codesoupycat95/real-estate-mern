import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user.route.js";  // Now because you are adding '.' in your filename way before extension and just before declaring extension after name, so there are two dots in file name which will create confusion for server if you don't mention `.js` in your imported file name. Otherwise normally we don't mention .`js`
dotenv.config();

mongoose.connect(process.env.MONGO_CONN).then(() => {
    console.log("Connection to database is successful");
}).catch((err) => {
    console.log(err);
});

const app = express();

app.listen(3000, () => {
    console.log("Server is running on port 3000!!!");
});

app.use("/api/user", userRouter);
