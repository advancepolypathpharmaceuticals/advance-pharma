// const nodemailer = require("nodemailer");

// const mailer = nodemailer.createTransport({
//     host: "smtp.gmail.com",
//     port: 465,
//     secure: true,
//     auth: {
//         user: process.env.MAIL_SENDER,
//         pass: process.env.MAIL_PASSWORD,
//     },
//     connectionTimeout: 20000,
//     greetingTimeout: 20000,
//     socketTimeout: 30000,
// });

// console.log("MAIL CONFIG:", {
//     sender: process.env.MAIL_SENDER,
//     passwordExists: !!process.env.MAIL_PASSWORD,
//     passwordLength: process.env.MAIL_PASSWORD
//         ? process.env.MAIL_PASSWORD.length
//         : 0,
// });

// mailer.verify((error, success) => {
//     if (error) {
//         console.error("========== MAILER VERIFY FAILED ==========");
//         console.error(error);
//         console.error("==========================================");
//     } else {
//         console.log("========== MAILER READY ==========");
//         console.log(success);
//         console.log("==================================");
//     }
// });

// module.exports = mailer;

const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const mailer = {
    sendMail: async function (options) {
        try {

            const { data, error } = await resend.emails.send({
                from: options.from || "noreply@advancepolypathicpharmaceuticals.in",
                to: options.to,
                subject: options.subject,
                html: options.html,
                text: options.text,
                replyTo: options.replyTo
            });

            if (error) {
                console.error("==========================================");
                console.error("RESEND EMAIL FAILED");
                console.error("==========================================");
                console.error(error);
                console.error("==========================================");

                throw new Error(error.message);
            }

            console.log("==========================================");
            console.log("EMAIL SENT SUCCESSFULLY");
            console.log("==========================================");
            console.log("Email ID:", data.id);
            console.log("==========================================");

            return data;

        } catch (error) {

            console.error("==========================================");
            console.error("EMAIL SENDING ERROR");
            console.error("==========================================");
            console.error(error);
            console.error("==========================================");

            throw error;
        }
    }
};

module.exports = mailer;