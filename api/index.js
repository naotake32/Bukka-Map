const express = require("express");
const cors = require("cors"); // CORSを追加
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const app = express();
const userRoute = require("../routes/users"); 
const pinRoute = require("../routes/pins");

dotenv.config();

app.use(express.json());
app.use(cors()); // CORSを有効にする

mongoose.connect(process.env.MONGO_URL, () => console.log("DB connected"));

app.get("/test", (req, res) => res.json({ msg: "testing...." }));
app.use("/api/users", userRoute);
app.use("/api/pins", pinRoute);

const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});

module.exports = app;
// app.listen(`https://bukka-map-prototype.vercel.app/`, () => {
//     console.log("server is running...");
// });