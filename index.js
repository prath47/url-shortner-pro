const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("dotenv").config();
const userRoutes = require("./routes/userRoutes");
const cookieParser = require("cookie-parser");
const { checkAuthentication } = require("./middlewares/authentication");
const generateURL = require("./routes/generateURL");
const Url = require("./models/urlModel");
const { islogin } = require("./middlewares/authentication");

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkAuthentication("token"));

mongoose
  .connect(
    `mongodb://shortstime400:${process.env.mongoPassword}@ac-i1ydxzx-shard-00-00.bzg4z6h.mongodb.net:27017,ac-i1ydxzx-shard-00-01.bzg4z6h.mongodb.net:27017,ac-i1ydxzx-shard-00-02.bzg4z6h.mongodb.net:27017/?ssl=true&replicaSet=atlas-111wz8-shard-0&authSource=admin&retryWrites=true&w=majority&appName=url-shortner-db`
  )
  .then((e) => console.log("connected to mongodb"))
  .catch((error) => {
    console.log(error);
  });

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

PORT = process.env.PORT || 3000;

app.get("/", async (req, res) => {
  try {
    if (req.user) {
      const data = await Url.find({ email: req.user.email });
      return res.render("home", {
        allUrls: data,
        user: req.user,
      });
    } else {
      return res.render("home");
    }
  } catch (error) {
    console.log(error);
  }
});

app.use("/user", userRoutes);
app.use("/generate-url", generateURL);

app.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const data = await Url.findOne({ shortid: id });
    if (data) {
      data.clicks++;
      await data.save();
      return res.redirect(data.fullurl);
    }
  } catch (error) {
    console.log(error);
  }
});

app.get("/delete/:id", islogin, async (req, res) => {
  try {
    const id = req.params.id;
    // console.log("here");

    const found = await Url.findOne({ shortid: id });
    // console.log(req.user);
    // console.log(found);
    if (req.user.email !== found.email) return res.send("not authorized");

    await Url.findOneAndDelete({ shortid: id });

    return res.redirect("/");
  } catch (error) {
    console.log(error);
  }
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
