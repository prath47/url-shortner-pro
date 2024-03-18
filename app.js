const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("dotenv").config();

mongoose
  .connect("mongodb://127.0.0.1:27017/url_shortner-pro")
  .then(() => {
    console.log("Mongodb Connected");
  })
  .catch((err) => {
    console.log(err);
  });

PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("HI");
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
