const { Router } = require("express");
const router = Router();
const Url = require("../models/urlModel");
const { v4: uuidv4 } = require("uuid");
const { islogin } = require("../middlewares/authentication");

router.post("/", islogin , async (req, res) => {
  try {
    const data = await req.body;
    const shortid = await uuidv4();
    const user = await req.user;
    const email = user.email;

    Url.create({
      fullurl: data.url,
      shortid: shortid,
      email: email,
      clicks: 0,
    });

    const allUrls = await Url.find({ email: email });

    res.redirect("/");
  } catch (error) {
    console.log(error);
  }
});

router.get("/delete-url", (req, res) => {});

module.exports = router;
