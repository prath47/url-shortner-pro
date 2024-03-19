const { model, Schema, Error } = require("mongoose");
const { randomBytes, createHmac } = require("crypto");
const { createTokenforUser } = require("../services/authentication");

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  salt: {
    type: String,
  },
});

userSchema.pre("save", function (next) {
  const user = this;

  if (!user.isModified("password")) return;

  const password = this.password;

  const salt = randomBytes(16).toString();

  const hashedPassword = createHmac("sha256", salt)
    .update(user.password)
    .digest("hex");

  this.salt = salt;
  this.password = hashedPassword;

  next();
});

userSchema.static(
  "matchPasswordAndGenerateToken",
  async function (email, password) {
    const user = await this.findOne({ email: email });

    if (!user) throw new Error("user not found");

    const salt = user.salt;
    const userProvidedPassword = createHmac("sha256", salt)
      .update(password)
      .digest("hex");

    if (userProvidedPassword !== user.password) {
      throw new Error("Invalid password/email");
    }

    const token = createTokenforUser(user);
    return token;
  }
);

const User = model("users", userSchema);

module.exports = User;
