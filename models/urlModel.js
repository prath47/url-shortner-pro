const { Schema, model } = require("mongoose");

const urlSchema = new Schema({
  fullurl: {
    type: String,
    required: true,
  },
  shortid: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  clicks: {
    type: String,
    default: 0,
  },
});

const Url = model("url", urlSchema);


module.exports = Url;
