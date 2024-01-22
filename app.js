const mongoose = require("mongoose");
const cors = require("cors");
const express = require("express");
const app = express();
const mongoConnect = require("./models/index");
const cookieParser = require('cookie-parser');
mongoConnect();
const PORT = process.env.PORT || 5000;
app.use(cors({
    origin: 'http://localhost:3000', // 클라이언트의 도메인
    credentials: true,
}));
const bodyParser = require("body-parser");
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


const indexRouter = require("./routes/index");
app.use("/", indexRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});