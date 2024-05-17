const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const app = express();
const userRoute = require("../routes/users"); 
const pinRoute = require("../routes/pins");

dotenv.config();

app.use(express.json())

mongoose.connect(process.env.MONGO_URL, () => console.log("DB connected"));


app.get("/test", (req,res)=> res.json({msg:"testing...."}))
app.use("/api/users",userRoute);
app.use("/api/pins", pinRoute);
app.post("pins");


app.listen(3001, () => {
    console.log("server is running...");
});
// module.exports = app;
// app.listen(`https://bukka-map-prototype.vercel.app/`, () => {
//     console.log("server is running...");
// });