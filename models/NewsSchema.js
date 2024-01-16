const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const NewsSchema = new Schema({
  title: {
    require: true,
    type: String,
  },
  context: {
    require: true,
    type: String,
  },
  date: {
    type: Date,
  },
  views: {
    type: Number,
  },
  bookmark: {
    type: Number,
  },
  img: {
    type: [String],
  },
});

module.exports = mongoose.model("News", NewsSchema);
