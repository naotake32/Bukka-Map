const express = require("express");
const cors = require("cors"); // CORSを追加
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const app = express();
const userRoute = require("../routes/users"); 
const pinRoute = require("../routes/pins");
const path = require("path");
const axios = require("axios");

dotenv.config();

app.use(express.json());
app.use(cors()); // CORSを有効にする

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB connected"))
  .catch((err) => console.error("DB connection error: ", err));

app.get("/test", (req, res) => res.json({ msg: "testing...." }));
app.use("/api/users", userRoute);
app.use("/api/pins", pinRoute);

// __dirnameのデバッグ出力
console.log('__dirname:', __dirname);

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, "..", "dist")));

// Fallback to index.html for any non-API routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "dist", "index.html"));
});

const port = process.env.PORT || 3001;
app.listen(port, async () => {
  console.log(`Server is running on port: ${port}`);

  // Test access to dist/index.html (debugging part)
  /*
  try {
    const response = await axios.get(`http://localhost:${port}/index.html`);
    if (response.status === 200) {
      console.log("Successfully accessed dist/index.html");
    } else {
      console.error("Failed to access dist/index.html, status code:", response.status);
    }
  } catch (error) {
    console.error("Error accessing dist/index.html:", error.message);
  }
  */
});
module.exports = app;
// app.listen(`https://bukka-map-prototype.vercel.app/`, () => {
//     console.log("server is running...");
// });