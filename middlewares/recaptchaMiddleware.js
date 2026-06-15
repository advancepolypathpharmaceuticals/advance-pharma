const verifyRecaptcha = require("../helpers/recaptcha");

module.exports = async (req, res, next) => {

    console.log("================================");
    console.log("URL:", req.originalUrl);
    console.log("BODY:", req.body);
    console.log("TOKEN:", req.body?.recaptchaToken);
    console.log("================================");

    return next();
};
