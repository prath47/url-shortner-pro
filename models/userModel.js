const { model, Schema, Error } = require("mongoose");
const { randomBytes, createHmac } = require("crypto");

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

const User = model("users", userSchema);

module.exports = User;
