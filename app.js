const mongoose = require("mongoose");
const express = require("express");
const app = express();
const mongoConnect = require("./models/index");
const PORT = 8000;

mongoConnect();

const indexRouter = require("./routes/index");
app.use("/", indexRouter);

app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
});
