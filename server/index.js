const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const app = express();
const pinRoute = require("../routes/pins");

dotenv.config();

app.use(express.json())

mongoose.connect(process.env.MONGO_URL, () => console.log("DB connected"));

app.use("/api/pins", pinRoute);
app.post("pins");


app.listen(3001, () => {
    console.log("server is running...");
});