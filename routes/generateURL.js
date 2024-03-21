const { Router } = require("express");
const router = Router();
const Url = require("../models/urlModel");
const { v4: uuidv4 } = require("uuid");

router.post("/", async (req, res) => {
  try {
    const data = await req.body;
    const shortid = await uuidv4();
    const user = await req.user;
    const email = user.email;
    console.log(shortid);
    console.log(data);
    console.log(email);

    Url.create({
      fullurl: data.url,
      shortid: shortid,
      email: email,
      clicks: 0,
    });

    const allUrls = await Url.find({ email: email });

    console.log(allUrls);
    res.render("home", {
      allUrls: allUrls,
      user: user,
    });
  } catch (error) {
    console.log(error);
  }
});



module.exports = router;
