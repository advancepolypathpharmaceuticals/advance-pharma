const nodeMailer = require("nodemailer");

const mailer = nodeMailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.MAIL_SENDER,
        pass: process.env.MAIL_PASSWORD,
    }
});

mailer.verify((error) => {
    if (error) {
        console.error("========== MAILER ERROR ==========");
        console.error(error);
        console.error("MAIL_SENDER:", process.env.MAIL_SENDER);
        console.error("MAIL_PASSWORD EXISTS:", !!process.env.MAIL_PASSWORD);
        console.error("==================================");
    } else {
        console.log("========== MAILER READY ==========");
    }
});

module.exports = mailer;
