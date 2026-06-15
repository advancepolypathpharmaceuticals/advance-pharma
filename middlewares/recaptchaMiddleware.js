const verifyRecaptcha = require("../helpers/recaptcha");

module.exports = async (req, res, next) => {

  console.log("BODY =", req.body);
  console.log("FILE =", req.file);
  console.log("TOKEN =", req.body?.recaptchaToken);

  next();
};
