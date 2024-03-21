const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("dotenv").config();
const userRoutes = require("./routes/userRoutes");
const cookieParser = require("cookie-parser");
const { checkAuthentication } = require("./middlewares/authentication");
const generateURL = require("./routes/generateURL");

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkAuthentication("token"));

mongoose
  .connect("mongodb://127.0.0.1:27017/url_shortner-pro")
  .then(() => {
    console.log("Mongodb Connected");
  })
  .catch((err) => {
    console.log(err);
  });

app.set("view engine", "ejs");
app.set("views", "views");

PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.render("home", {
    user: req.user,
  });
});

app.use("/user", userRoutes);
app.use("/generate-url", generateURL);

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
