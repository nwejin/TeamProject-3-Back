const mongoose = require("mongoose");
const cors = require("cors");
const express = require("express");
const app = express();
const mongoConnect = require("./models/Mindex");
mongoConnect();
const PORT = process.env.PORT || 8000;
app.use(cors());
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const indexRouter = require("./routes/Rindex");
app.use("/", indexRouter);
const newsRouter = require("./routes/Rnews");
app.use("/news", newsRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
