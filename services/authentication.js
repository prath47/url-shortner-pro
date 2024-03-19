const JWT = require("jsonwebtoken");

const secret = "somesecretkey";

function createTokenforUser(user) {
  const payload = {
    _id: user._id,
    name: user.name,
    email: user.email,
  };

  const token = JWT.sign(payload, secret);
  return token;
}

function validateToken(token) {
  const payload = JWT.verify(token, secret);
  return payload;
}

module.exports = {
  createTokenforUser,
  validateToken,
};
