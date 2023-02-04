const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const app = express();
const pinRoute = require("../routes/");

dotenv.config();

app.use(express.json())

mongoose.connect(process.env.MONGO_URL);

app.post("pins");

app.use("/api/pins", pinRoute);

app.listen(3001, () => {
    console.log("srver is running...");
});