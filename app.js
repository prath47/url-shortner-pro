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

app.get("/delete/:id", islogin , async (req, res) => {
  try {
    const id = req.params.id;
    console.log("here");

    const found = await Url.findOne({ shortid: id });
    console.log(req.user);
    // if (req.user.email !== found.email) return res.send("not authorized");
    await Url.findOneAndDelete({ shortid: id });
    console.log(found);

    res.redirect("/");
  } catch (error) {
    console.log(error);
  }
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
