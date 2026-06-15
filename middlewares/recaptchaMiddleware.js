const verifyRecaptcha = require("../helpers/recaptcha");

module.exports = async (req, res, next) => {

  const token = req.body.recaptchaToken;

  if (!token) {
    return res.status(400).send("reCAPTCHA token missing");
  }

  const verified = await verifyRecaptcha(token);

  if (!verified) {
    return res.status(400).send("reCAPTCHA verification failed");
  }

  next();
};
