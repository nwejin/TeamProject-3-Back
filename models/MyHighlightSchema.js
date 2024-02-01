const mongoose = require("mongoose");
const { Schema } = require("mongoose");

// const Highlight = new Schema({
//   news_id :
// })

const MyHighlight = new Schema({
  user_id: {
    ref: "User",
    type: Schema.Types.ObjectId,
    require: true,
  },
  highlight: [{
    news_id : {
      type: String, require: true
    },
    word: {type: [String], require: true}
  }],
});

module.exports = mongoose.model("MyHighlight", MyHighlight);
