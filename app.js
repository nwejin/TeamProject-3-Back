const mongoose = require("mongoose");
const cors = require("cors"); // 추가
const express = require("express");
const app = express();
const mongoConnect = require("./models/index");
mongoConnect();

const PORT = process.env.PORT || 5000;
app.use(cors()); // 추가

const indexRouter = require("./routes/index");
app.use("/", indexRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});