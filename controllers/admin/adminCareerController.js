const Career = require("../../models/Career");
const mailer = require("../../mailer");

// Display all career applications
async function homePage(req, res) {
  try {
    const data = await Career.find().sort({ _id: -1 });
    res.render("admin/career/index", {
      session: req.session,
      title: "Admin Career Applications",
      data,
    });
  } catch (error) {
    console.error(error);
    res.render("admin/career/index", {
      session: req.session,
      title: "Admin Career Applications",
      data: [],
      errorMessage: "Could not fetch data. Please try again later.",
    });
  }
}

// Mark as reviewed & send email
async function editPage(req, res) {
  try {
    const application = await Career.findOne({ _id: req.params._id });
    if (!application) return res.status(404).send("Application not found");

    if (!application.reviewed) {
      application.reviewed = true;
      await application.save();

      mailer.sendMail({
        from: process.env.MAIL_SENDER,
        to: application.email,
        subject: "Your Career Application Status – Advance Poly Pathic Pharmaceuticals",
        html: `
          <div style="font-family: Arial, Helvetica, sans-serif; max-width: 650px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; background: #f9f9f9;">
            <h2 style="color: #00d084; text-align: center; margin-bottom: 20px; text-decoration: underline;">
              Career Application Reviewed
            </h2>

            <p style="font-size: 16px; color: #333;">
              Dear <strong style="color:#0066cc;">${application.name}</strong>,
            </p>

            <p style="font-size: 15px; color: #333; line-height: 1.6;">
              We are pleased to inform you that your application for the position of 
              <strong style="color:#0066cc;">${application.position}</strong> has been successfully reviewed.  
              Our HR team will contact you if you are shortlisted.
            </p>

            <p style="font-size: 15px; color: #333; line-height: 1.6;">
              If you have any further questions or need additional information, please do not hesitate to contact us.
            </p>

            <hr style="margin: 30px 0; border: 0; border-top: 1px solid #ddd;">

            <p style="font-size: 15px; color: #333; margin-top: 30px;">
              Best Regards, <br>
              <strong style="color:#00d084;">© ${new Date().getFullYear()} Advance Poly Pathic Pharmaceuticals Limited.</strong>
            </p>
          </div>
        `,
      }, (err) => {
        if (err) console.error(err);
      });
    }

    res.redirect("/admin/career");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}

// Delete application
async function deleteRecord(req, res) {
  try {
    const application = await Career.findOne({ _id: req.params._id });
    if (!application) return res.status(404).send("Application not found");

    await application.deleteOne();
    res.redirect("/admin/career");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}

module.exports = {
  homePage,
  editPage,
  deleteRecord,
};
