const { validateToken } = require("../services/authentication");

function checkAuthentication(cookiename) {
  return (req, res, next) => {
    const tokenValue = req.cookies[cookiename];

    if (!tokenValue) {
      return next();
    }

    try {
      const userPayload = validateToken(tokenValue);
      req.user = userPayload;
    } catch (error) {}
    return next();
  };
}

module.exports = {
  checkAuthentication,
};
