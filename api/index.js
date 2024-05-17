const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const path = require("path"); // 追加

const app = express();
const userRoute = require("../routes/users");
const pinRoute = require("../routes/pins");

dotenv.config();

app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URL, () => console.log("DB connected"));

// デバッグ用コード：リクエストとレスポンスをログに記録
app.use((req, res, next) => {
    console.log(`Received ${req.method} request from ${req.ip} for ${req.url}`);
    next();
});

app.get("/test", (req, res) => res.json({ msg: "testing...." }));
app.use("/api/users", userRoute);
app.use("/api/pins", pinRoute);

// 静的ファイルの提供設定
app.use(express.static(path.join(__dirname, 'public')));

// すべてのその他のリクエストをindex.htmlにリダイレクト
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});

module.exports = app;
// app.listen(`https://bukka-map-prototype.vercel.app/`, () => {
//     console.log("server is running...");
// });