const { Router } = require("express");
const User = require("../models/userModel");

const router = Router();

router.get("/signin", (req, res) => {
  res.render("signin");
});

router.post("/signin", async (req, res) => {
  try {
    const data = await req.body;
  } catch (error) {
    console.log(error);
  }
});

router.get("/signup", (req, res) => {
  res.render("signup");
});

router.post("/signup", async (req, res) => {
  try {
    const data = await req.body;
    console.log(data)
    User.create({
      name: data.name,
      email: data.email,
      password: data.password,
    });

    res.redirect('/')
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
