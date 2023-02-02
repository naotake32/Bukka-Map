const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

const app = express();

dotenv.config();

mongoose.connect(process.env.MONGO_URL);

app.post("pins");

app.listen(3001, () => {
    console.log("srver is running...");
});