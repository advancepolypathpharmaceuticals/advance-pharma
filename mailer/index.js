const nodemailer = require("nodemailer");

const mailer = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.MAIL_SENDER,
        pass: process.env.MAIL_PASSWORD,
    },
    connectionTimeout: 20000,
    greetingTimeout: 20000,
    socketTimeout: 30000,
});

console.log("MAIL CONFIG:", {
    sender: process.env.MAIL_SENDER,
    passwordExists: !!process.env.MAIL_PASSWORD,
    passwordLength: process.env.MAIL_PASSWORD
        ? process.env.MAIL_PASSWORD.length
        : 0,
});

mailer.verify((error, success) => {
    if (error) {
        console.error("========== MAILER VERIFY FAILED ==========");
        console.error(error);
        console.error("==========================================");
    } else {
        console.log("========== MAILER READY ==========");
        console.log(success);
        console.log("==================================");
    }
});

module.exports = mailer;
