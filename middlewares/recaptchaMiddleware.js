const verifyRecaptcha = require("../helpers/recaptcha");

module.exports = async (req, res, next) => {
  const token = req.body?.recaptchaToken;

  console.log("TOKEN:", token ? "PRESENT" : "MISSING");

  if (!token) {
    return res.status(400).send("reCAPTCHA token missing");
  }

  const verified = await verifyRecaptcha(token);

  console.log("VERIFIED:", verified);

  next(); // TEMPORARY
};
