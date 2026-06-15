const verifyRecaptcha = require("../helpers/recaptcha");

module.exports = async (req, res, next) => {

  console.log("================================");
  console.log("URL:", req.originalUrl);
  console.log("BODY:", req.body);
  console.log("TOKEN:", JSON.stringify(req.body?.recaptchaToken));
  console.log("================================");

  const token = req.body?.recaptchaToken;

  if (!token) {
    return res.status(400).send("reCAPTCHA token missing");
  }

  const verified = await verifyRecaptcha(token);

  console.log("VERIFIED:", verified);

  if (!verified) {
    return res.status(400).send("reCAPTCHA verification failed");
  }

  next();
};
