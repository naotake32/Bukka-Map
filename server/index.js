const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const app = express();
const userRoute = require("../routes/users"); 
const pinRoute = require("../routes/pins");

dotenv.config();

app.use(express.json())
app.use(cors());

mongoose.connect(process.env.MONGO_URL, () => console.log("DB connected"));
//デバッグ用コード：リクエストとレスポンスをログに記録
app.use((req, res, next) => {
    console.log(`Received ${req.method} request from ${req.ip} for ${req.url}`);
    next();
  });

app.get("/test", (req,res)=> res.json({msg:"testing...."}))
app.use("/api/users",userRoute);
app.use("/api/pins", pinRoute);
app.post("pins");


app.listen(3001, () => {
    console.log("server is running...");
});