const nodemailer = require("nodemailer");

const mailer = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,

    auth: {
        user: process.env.MAIL_SENDER,
        pass: process.env.MAIL_PASSWORD,
    },

    connectionTimeout: 20000,
    greetingTimeout: 20000,
    socketTimeout: 30000,
});


// ======================================================
// MAIL CONFIGURATION CHECK
// ======================================================

console.log("==========================================");
console.log("MAIL CONFIGURATION");
console.log("==========================================");

console.log(
    "MAIL_SENDER:",
    process.env.MAIL_SENDER || "NOT SET"
);

console.log(
    "MAIL_PASSWORD EXISTS:",
    !!process.env.MAIL_PASSWORD
);

console.log(
    "MAIL_PASSWORD LENGTH:",
    process.env.MAIL_PASSWORD
        ? process.env.MAIL_PASSWORD.length
        : 0
);

console.log("SMTP HOST: smtp.gmail.com");
console.log("SMTP PORT: 465");
console.log("SMTP SECURE: true");

console.log("==========================================");


// ======================================================
// VERIFY SMTP CONNECTION
// ======================================================

mailer.verify(function (error, success) {

    if (error) {

        console.error("==========================================");
        console.error("MAILER VERIFY FAILED");
        console.error("==========================================");

        console.error("Error Code:", error.code);
        console.error("Error Command:", error.command);
        console.error("Error Message:", error.message);

        console.error("Full Error:");
        console.error(error);

        console.error("==========================================");

    } else {

        console.log("==========================================");
        console.log("MAILER READY");
        console.log("==========================================");

        console.log(
            "SMTP connection to Gmail is working."
        );

        console.log("==========================================");
    }

});


// ======================================================
// EXPORT MAILER
// ======================================================

module.exports = mailer;
