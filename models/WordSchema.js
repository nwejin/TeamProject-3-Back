const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const WordSchema = new Schema({
  info: {
    require: true,
    type: String,
  },
});

module.exports = mongoose.model("Word", WordSchema);
