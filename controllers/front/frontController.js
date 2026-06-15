const ContactUs = require("../../models/ContactUs");
const Career = require("../../models/Career");
const Team = require("../../models/Team");
const Service = require("../../models/Service");
const Faq = require("../../models/Faq");
const Testimonial = require("../../models/Testimonial");
const User = require("../../models/User");

const mailer = require("../../mailer");
const session = require("express-session");

async function homePage(req, res) {
  try {
    let teams = await Team.find();
    let services = await Service.find(
      {},
      { name: 1, pic: 1, shortDescription: 1, price: 1 },
    ).sort({ _id: -1 });
    let faqs = await Faq.find();
    let testimonials = await Testimonial.find();
    res.render("index", {
      session: req.session,
      title: "Home",
      teams,
      services,
      faqs,
      testimonials,
    });
  } catch (error) {
    console.log(error);
  }
}
async function aboutPage(req, res) {
  let teams = await Team.find();
  let services = await Service.find().sort({ _id: -1 });
  let faqs = await Faq.find();
  let testimonials = await Testimonial.find();
  res.render("aboutPage", {
    session: req.session,
    title: "About",
    teams,
    services,
    faqs,
    testimonials,
  });
}
async function featurePage(req, res) {
  let teams = await Team.find();
  let services = await Service.find().sort({ _id: -1 });
  let faqs = await Faq.find();
  let testimonials = await Testimonial.find();
  res.render("featurePage", {
    session: req.session,
    title: "Feature",
    teams,
    services,
    faqs,
    testimonials,
  });
}
async function servicePage(req, res) {
  let teams = await Team.find();
  let services = await Service.find(
    {},
    { name: 1, pic: 1, shortDescription: 1, price: 1 },
  ).sort({ _id: -1 });
  let faqs = await Faq.find();
  let testimonials = await Testimonial.find();
  res.render("servicePage", {
    session: req.session,
    title: "Products",
    teams,
    services,
    faqs,
    testimonials,
  });
}
async function serviceShowPage(req, res) {
  let services = await Service.find(
    {},
    { name: 1, pic: 1, shortDescription: 1, price: 1 },
  ).sort({ _id: -1 });
  let service = await Service.findOne({ _id: req.params._id });
  let faqs = await Faq.find();
  res.render("serviceShowPage", {
    session: req.session,
    title: "Product",
    services,
    service,
  });
}

// All Products Page
async function allProductPage(req, res) {
  try {
    // Fetch all products
    const services = await Service.find(
      {},
      { name: 1, pic: 1, shortDescription: 1, price: 1 },
    ).sort({ _id: -1 });

    res.render("allProductPage", {
      session: req.session,
      title: "All Products",
      services, // pass to view
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
}

async function testimonialPage(req, res) {
  let teams = await Team.find();
  let services = await Service.find().sort({ _id: -1 });
  let faqs = await Faq.find();
  let testimonials = await Testimonial.find();
  res.render("testimonialPage", {
    session: req.session,
    title: "Testimonial",
    teams,
    services,
    faqs,
    testimonials,
  });
}
async function contactPage(req, res) {
  let teams = await Team.find();
  let testimonials = await Testimonial.find();
  res.render("contactPage", {
    session: req.session,
    title: "Contact Us",
    errorMessage: {},
    data: {},
    show: false,
    teams,
    testimonials,
  });
}
async function contactStorePage(req, res) {
  try {
    var teams = await Team.find();
    var testimonials = await Testimonial.find();
    var data = new ContactUs(req.body);
    data.date = new Date();
    await data.save();

    mailer.sendMail(
      {
        from: process.env.MAIL_SENDER,
        to: data.email,
        subject:
          "Acknowledgement of Your Query – Advance Poly Pathic Pharmaceuticals",
        html: `
                    <div style="font-family: Arial, Helvetica, sans-serif; max-width: 650px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; background: #f9f9f9;">
                
                        <!-- HEADER -->
                        <h2 style="color: #00d084; text-align: center; text-decoration: underline; margin-bottom: 20px;">
                            Advance Poly Pathic Pharmaceuticals Limited
                        </h2>
                
                        <!-- Greeting -->
                        <p style="font-size: 16px; color: #333;">
                            Dear <strong style="color:#0066cc;">${
                              data.name
                            }</strong>,
                        </p>
                
                        <!-- Body -->
                        <p style="font-size: 15px; color: #333; line-height: 1.6;">
                            Thank you for contacting <strong style="color:#00d084;">Advance Poly Pathic Pharmaceuticals Limited</strong>.  
                            We have successfully received your query and our team is currently reviewing the details you provided.  
                            One of our representatives will get back to you shortly with the necessary assistance. 
                        </p>
                
                        <!-- Contact Info -->
                        <p style="font-size: 15px; color: #333; line-height: 1.6; margin-bottom: 10px;">
                            For your convenience, you may also reach us directly:
                        </p>
                        
                        <table style="font-size: 15px; color: #333; line-height: 1.8; width: 100%; max-width: 600px;">
                            <tr>
                                <td style="padding: 6px 0;">
                                    <img src="https://img.icons8.com/color/24/000000/new-post.png" alt="Email" style="vertical-align: middle; margin-right: 8px;">
                                    <a href="mailto:advancepolypathpharmaceuticals@gmail.com" style="color:#0066cc; text-decoration: none;">advancepolypathpharmaceuticals@gmail.com</a>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 6px 0;">
                                    <img src="https://img.icons8.com/color/24/000000/phone.png" alt="Phone" style="vertical-align: middle; margin-right: 8px;">
                                    <a href="tel:+9199893278" style="color:#0066cc; text-decoration: none;">+91 9199893278</a>, 
                                    <a href="tel:+917677413112" style="color:#0066cc; text-decoration: none;">+91 7677413112</a>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 6px 0;">
                                    <img src="https://img.icons8.com/color/24/000000/whatsapp.png" alt="WhatsApp" style="vertical-align: middle; margin-right: 8px;">
                                    <a href="https://wa.me/917903159447" style="color:#0066cc; text-decoration: none;">+91 7903159447</a>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 6px 0;">
                                    <img src="https://img.icons8.com/color/24/000000/domain.png" alt="Website" style="vertical-align: middle; margin-right: 8px;">
                                    <a href="https://advancepolypathicpharmaceuticals.in" style="color:#0066cc; text-decoration: none;">advancepolypathicpharmaceuticals.in</a>
                                </td>
                            </tr>
                        </table>
                
                        <!-- Closing -->
                        <p style="font-size: 15px; color: #333; line-height: 1.6; margin-top: 20px;">
                            We truly appreciate your interest and look forward to serving you.
                        </p>
                
                        <p style="font-size: 15px; color: #333; margin-top: 30px;">
                            Sincerely, <br>
                            <strong style="color:#00d084;">Advance Poly Pathic Pharmaceuticals Limited</strong>
                        </p>
                
                        <!-- Footer -->
                        <hr style="margin: 30px 0; border: 0; border-top: 1px solid #ddd;">
                        <p style="font-size: 13px; color: #777; text-align: center;">
                            © ${new Date().getFullYear()} Advance Poly Pathic Pharmaceuticals Limited.<br> 
                            This is an automated acknowledgement. Please do not reply directly to this email.  
                        </p>
                    </div>
                `,
      },
      (error) => {
        if (error) console.log(error);
      },
    );
    mailer.sendMail(
      {
        from: process.env.MAIL_SENDER,
        to: process.env.MAIL_SENDER,
        subject:
          "Query Alert: A New Message/Contact Form Submission Has Been Received",
        html: `
                    <div style="font-family: Arial, Helvetica, sans-serif; max-width: 650px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; background: #f9f9f9;">
                        
                        <!-- Header -->
                        <h2 style="color: #00d084; text-align: center; margin-bottom: 20px; text-decoration: underline;">
                            New Customer Inquiry Received
                        </h2>
                
                        <!-- Info Table -->
                        <table style="width: 100%; border-collapse: collapse; font-size: 15px; color: #333;">
                            <tbody>
                                <tr style="background: #f1f1f1;">
                                    <th style="text-align: left; padding: 10px; border: 1px solid #ddd;">Name</th>
                                    <td style="padding: 10px; border: 1px solid #ddd;">${
                                      data.name
                                    }</td>
                                </tr>
                                <tr>
                                    <th style="text-align: left; padding: 10px; border: 1px solid #ddd;">Email</th>
                                    <td style="padding: 10px; border: 1px solid #ddd;">${
                                      data.email
                                    }</td>
                                </tr>
                                <tr style="background: #f1f1f1;">
                                    <th style="text-align: left; padding: 10px; border: 1px solid #ddd;">Phone</th>
                                    <td style="padding: 10px; border: 1px solid #ddd;">${
                                      data.phone
                                    }</td>
                                </tr>
                                <tr>
                                    <th style="text-align: left; padding: 10px; border: 1px solid #ddd;">Subject</th>
                                    <td style="padding: 10px; border: 1px solid #ddd;">${
                                      data.subject
                                    }</td>
                                </tr>
                                <tr style="background: #f1f1f1;">
                                    <th style="text-align: left; padding: 10px; border: 1px solid #ddd;">Message</th>
                                    <td style="padding: 10px; border: 1px solid #ddd;">${
                                      data.message
                                    }</td>
                                </tr>
                                <tr>
                                    <th style="text-align: left; padding: 10px; border: 1px solid #ddd;">Date</th>
                                    <td style="padding: 10px; border: 1px solid #ddd;">${
                                      data.date
                                    }</td>
                                </tr>
                            </tbody>
                        </table>
                
                        <!-- Footer -->
                        <p style="margin-top: 20px; font-size: 13px; color: #777; text-align: center;">
                            © ${new Date().getFullYear()} Advance Poly Pathic Pharmaceuticals Limited.<br> 
                            This is an automated notification. Please log in to the admin panel for more details.
                        </p>
                    </div>
            `,
      },
      (error) => {
        if (error) console.log(error);
      },
    );
    res.render("contactPage", {
      session: req.session,
      title: "Contact Us",
      errorMessage: {},
      data: {},
      show: true,
      teams,
      testimonials,
    });
  } catch (error) {
    // console.log(error)
    let errorMessage = {};
    error.errors.name ? (errorMessage["name"] = error.errors.name.message) : "";
    error.errors.email
      ? (errorMessage["email"] = error.errors.email.message)
      : "";
    error.errors.phone
      ? (errorMessage["phone"] = error.errors.phone.message)
      : "";
    error.errors.subject
      ? (errorMessage["subject"] = error.errors.subject.message)
      : "";
    error.errors.message
      ? (errorMessage["message"] = error.errors.message.message)
      : "";
    console.log(errorMessage);
    res.render("contactPage", {
      session: req.session,
      title: "Contact Us",
      errorMessage,
      data,
    });
  }
}

// -------------------- Career --------------------
async function careerPage(req, res) {
  let teams = await Team.find();
  let testimonials = await Testimonial.find();
  res.render("careerPage", {
    session: req.session,
    title: "Career",
    errorMessage: {},
    data: {},
    show: false,
    teams,
    testimonials,
  });
}

async function careerStorePage(req, res) {
  try {
    let teams = await Team.find();
    let testimonials = await Testimonial.find();

    // FIRST: Validate all required fields (before file check)
    const requiredFields = ["name", "email", "phone", "position", "message"];
    let errorMessage = {};
    let hasErrors = false;

    // Check each required field
    requiredFields.forEach((field) => {
      if (!req.body[field] || req.body[field].trim() === "") {
        errorMessage[field] = `${
          field.charAt(0).toUpperCase() + field.slice(1)
        } is required`;
        hasErrors = true;
      }
    });

    // Validate email format
    if (req.body.email && !isValidEmail(req.body.email)) {
      errorMessage.email = "Please enter a valid email address";
      hasErrors = true;
    }

    // Validate phone format (basic check)
    if (req.body.phone && !isValidPhone(req.body.phone)) {
      errorMessage.phone = "Please enter a valid phone number";
      hasErrors = true;
    }

    // SECOND: Check file upload (only if other fields are valid)
    if (!req.file && !hasErrors) {
      errorMessage.resume = "Resume is required";
      hasErrors = true;
    }

    // If there are any errors, return to form with error messages
    if (hasErrors) {
      console.log("FORM VALIDATION ERRORS:", errorMessage);
      return res.render("careerPage", {
        session: req.session,
        title: "Career",
        errorMessage: errorMessage,
        data: req.body, // Preserve entered data
        show: false,
        teams,
        testimonials,
      });
    }

    console.log("SUCCESS: All fields validated");

    // Create career data with file path

    const resumeURL = `${req.protocol}://${req.get(
      "host",
    )}/uploads/resume/${req.file.filename}`;

    const careerData = {
      name: req.body.name.trim(),
      email: req.body.email.trim(),
      phone: req.body.phone.trim(),
      position: req.body.position.trim(),
      message: req.body.message.trim(),
      resume: resumeURL,
      date: new Date(),
      reviewed: false,
    };

    console.log("Data to save to database:", careerData);

    let data = new Career(careerData);
    await data.save();

    console.log("SUCCESS: Career application saved to database");

    // Send emails (your existing email code)
    mailer.sendMail(
      {
        from: process.env.MAIL_SENDER,
        to: data.email,
        subject:
          "Acknowledgement of Your Career Application – Advance Poly Pathic Pharmaceuticals",
        html: `
        <div style="font-family: Arial, Helvetica, sans-serif; max-width:650px; margin:auto; padding:20px; border:1px solid #e0e0e0; border-radius:8px; background:#f9f9f9;">
          <h2 style="color:#00d084; text-align:center; text-decoration:underline; margin-bottom:20px;">
            Advance Poly Pathic Pharmaceuticals Limited
          </h2>

          <p style="font-size:16px; color:#333;">
            Dear <strong style="color:#0066cc;">${data.name}</strong>,
          </p>

          <p style="font-size:15px; color:#333; line-height:1.6;">
            Thank you for applying for the position of <strong style="color:#00d084;">${
              data.position
            }</strong> at Advance Poly Pathic Pharmaceuticals Limited.  
            We have successfully received your application and resume. Our recruitment team will review your details and get back to you shortly.
          </p>
          <p>You can view your submitted resume here: <a href="${data.resume}" style="color:#0066cc;">Download Resume</a></p>

          <p style="font-size:15px; color:#333; line-height:1.6; margin-bottom:10px;">
            For any inquiries, you may reach us directly:
          </p>

          <table style="font-size:15px; color:#333; line-height:1.8; width:100%; max-width:600px;">
            <tr>
              <td style="padding:6px 0;">
                <img src="https://img.icons8.com/color/24/000000/new-post.png" alt="Email" style="vertical-align:middle; margin-right:8px;">
                <a href="mailto:advancepolypathpharmaceuticals@gmail.com" style="color:#0066cc; text-decoration:none;">advancepolypathpharmaceuticals@gmail.com</a>
              </td>
            </tr>
            <tr>
              <td style="padding:6px 0;">
                <img src="https://img.icons8.com/color/24/000000/phone.png" alt="Phone" style="vertical-align:middle; margin-right:8px;">
                <a href="tel:+9199893278" style="color:#0066cc; text-decoration:none;">+91 9199893278</a>,
                <a href="tel:+917677413112" style="color:#0066cc; text-decoration:none;">+91 7677413112</a>
              </td>
            </tr>
            <tr>
              <td style="padding:6px 0;">
                <img src="https://img.icons8.com/color/24/000000/domain.png" alt="Website" style="vertical-align:middle; margin-right:8px;">
                <a href="https://advancepolypathicpharmaceuticals.in" style="color:#0066cc; text-decoration:none;">advancepolypathicpharmaceuticals.in</a>
              </td>
            </tr>
          </table>

          <p style="font-size:15px; color:#333; line-height:1.6; margin-top:20px;">
            We appreciate your interest in joining our team and look forward to connecting with you.
          </p>

          <p style="font-size:15px; color:#333; margin-top:30px;">
            Sincerely, <br>
            <strong style="color:#00d084;">Advance Poly Pathic Pharmaceuticals Limited</strong>
          </p>

          <hr style="margin:30px 0; border:0; border-top:1px solid #ddd;">
          <p style="font-size:13px; color:#777; text-align:center;">
            © ${new Date().getFullYear()} Advance Poly Pathic Pharmaceuticals Limited.<br>
            This is an automated acknowledgement. Please do not reply directly to this email.
          </p>
        </div>
      `,
      },
      (error) => {
        if (error) console.log("Email error:", error);
        else console.log("Acknowledgement email sent");
      },
    );

    mailer.sendMail(
      {
        from: process.env.MAIL_SENDER,
        to: process.env.MAIL_SENDER,
        subject: "Career Application Alert: New Submission Received",
        html: `
        <div style="font-family: Arial, Helvetica, sans-serif; max-width:650px; margin:auto; padding:20px; border:1px solid #e0e0e0; border-radius:8px; background:#f9f9f9;">
          <h2 style="color:#00d084; text-align:center; text-decoration:underline; margin-bottom:20px;">
            New Career Application Received
          </h2>

          <table style="width:100%; border-collapse:collapse; font-size:15px; color:#333;">
            <tr style="background:#f1f1f1;">
              <th style="text-align:left; padding:10px; border:1px solid #ddd;">Name</th>
              <td style="padding:10px; border:1px solid #ddd;">${data.name}</td>
            </tr>
            <tr>
              <th style="text-align:left; padding:10px; border:1px solid #ddd;">Email</th>
              <td style="padding:10px; border:1px solid #ddd;">${data.email}</td>
            </tr>
            <tr style="background:#f1f1f1;">
              <th style="text-align:left; padding:10px; border:1px solid #ddd;">Phone</th>
              <td style="padding:10px; border:1px solid #ddd;">${data.phone}</td>
            </tr>
            <tr>
              <th style="text-align:left; padding:10px; border:1px solid #ddd;">Position</th>
              <td style="padding:10px; border:1px solid #ddd;">${data.position}</td>
            </tr>
            <tr style="background:#f1f1f1;">
              <th style="text-align:left; padding:10px; border:1px solid #ddd;">Message</th>
              <td style="padding:10px; border:1px solid #ddd;">${data.message}</td>
            </tr>
            <tr>
              <th style="text-align:left; padding:10px; border:1px solid #ddd;">Resume</th>
              <td style="padding:10px; border:1px solid #ddd;"><a href="${data.resume}" style="color:#0066cc;">View/Download</a></td>
            </tr>
            <tr style="background:#f1f1f1;">
              <th style="text-align:left; padding:10px; border:1px solid #ddd;">Date</th>
              <td style="padding:10px; border:1px solid #ddd;">${data.date}</td>
            </tr>
          </table>

          <hr style="margin:30px 0; border:0; border-top:1px solid #ddd;">
          <p style="font-size:13px; color:#777; text-align:center;">
            © ${new Date().getFullYear()} Advance Poly Pathic Pharmaceuticals Limited.<br>
            This is an automated notification. Please log in to the admin panel for more details.
          </p>
        </div>
      `,
      },
      (error) => {
        if (error) console.log("Admin email error:", error);
      },
    );

    // Render success page
    res.render("careerPage", {
      session: req.session,
      title: "Career",
      errorMessage: {},
      data: {}, // Clear form data
      show: true, // Show success message
      teams,
      testimonials,
    });
  } catch (error) {
    console.error("CATCH BLOCK: Career store error occurred");
    console.error("Error message:", error.message);

    let errorMessage = {};

    if (
      error.message &&
      error.message.includes("Only PDF and Word documents")
    ) {
      errorMessage.resume = "Only PDF and Word documents are allowed";
    } else if (error.message && error.message.includes("File too large")) {
      errorMessage.resume = "File size must be less than 5MB";
    } else if (error.errors) {
      // Handle mongoose validation errors
      for (let key in error.errors) {
        errorMessage[key] = error.errors[key].message;
      }
    } else {
      errorMessage.general = "Server error. Please try again.";
    }

    res.render("careerPage", {
      session: req.session,
      title: "Career",
      errorMessage,
      data: req.body, // Preserve entered data
      show: false,
      teams: await Team.find(),
      testimonials: await Testimonial.find(),
    });
  }
}

// ✅ Add validation helper functions
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isValidPhone(phone) {
  // Basic phone validation - adjust as needed
  const phoneRegex = /^[0-9+\-\s()]{10,}$/;
  return phoneRegex.test(phone);
}

async function faqPage(req, res) {
  let teams = await Team.find();
  let services = await Service.find().sort({ _id: -1 });
  let faqs = await Faq.find();
  let testimonials = await Testimonial.find();
  res.render("faqPage", {
    session: req.session,
    title: "Faq",
    teams,
    services,
    faqs,
    testimonials,
  });
}
async function offerPage(req, res) {
  let teams = await Team.find();
  let services = await Service.find().sort({ _id: -1 });
  let faqs = await Faq.find();
  let testimonials = await Testimonial.find();
  res.render("offerPage", {
    session: req.session,
    title: "Offer",
    teams,
    services,
    faqs,
    testimonials,
  });
}
async function teamPage(req, res) {
  let teams = await Team.find();
  let services = await Service.find().sort({ _id: -1 });
  let faqs = await Faq.find();
  let testimonials = await Testimonial.find();
  res.render("teamPage", {
    session: req.session,
    title: "Team",
    teams,
    services,
    faqs,
    testimonials,
  });
}
function errorPage(req, res) {
  res.render("404Page", { session: req.session, title: "404! Page Not Found" });
}

// Registration functions
async function registerPage(req, res) {
  res.redirect("/login?tab=register");
}

async function registerStore(req, res) {
  try {
    const { firstName, lastName, email, phone, password, confirmPassword } =
      req.body;

    console.log("📝 Registration attempt:", {
      firstName,
      lastName,
      email,
      phone,
    });
    console.log("📸 File uploaded:", req.file ? req.file.filename : "No file");

    // Validation
    if (password !== confirmPassword) {
      console.log("❌ Password mismatch");
      return res.redirect("/login?tab=register&error=password_mismatch");
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email: email }, { username: email }],
    });

    if (existingUser) {
      console.log("❌ User already exists:", {
        existingEmail: existingUser.email,
        existingUsername: existingUser.username,
        attemptedEmail: email,
      });
      return res.redirect("/login?tab=register&error=user_exists");
    }

    // Create new user
    const newUser = new User({
      firstName: firstName,
      lastName: lastName,
      email: email,
      username: email, // Using email as username
      phone: phone,
      password: password,
      role: "Customer",
    });

    // Handle profile picture if uploaded
    if (req.file) {
      newUser.pic = req.file.filename;
      console.log("🖼️ Profile picture saved:", newUser.pic);
    }

    await newUser.save();

    console.log("✅ User created:", {
      id: newUser._id,
      name: `${firstName} ${lastName}`,
      email: newUser.email,
      pic: newUser.pic || "No profile picture",
    });

    // Redirect to login with success message
    res.redirect("/login?success=true&tab=login");
  } catch (error) {
    console.log("❌ Registration error:", error);

    // Handle specific errors
    if (error.code === 11000) {
      return res.redirect("/login?tab=register&error=user_exists");
    }

    res.redirect("/login?tab=register&error=registration_failed");
  }
}

async function login(req, res) {
  const activeTab = req.query.tab === "register" ? "register" : "login";

  res.render("login", {
    session: req.session,
    title: "Login",
    errorMessage: {},
    data: req.body || {},
    query: req.query,
    activeTab: activeTab,
  });
}

// In your loginStore function
async function loginStore(req, res) {
  try {
    const { username, password } = req.body;

    console.log("🔐 Login attempt:", { username });

    // Find user by username OR email
    const user = await User.findOne({
      $or: [{ username: username }, { email: username }],
    });

    if (!user) {
      console.log("❌ User not found:", username);
      return res.redirect("/login?error=invalid_credentials");
    }

    console.log("👤 User found:", {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
      name: user.name,
      phone: user.phone,
    });

    // DEBUG: Log the password comparison
    console.log("🔑 Password comparison:", {
      inputPassword: password,
      storedPassword: user.password,
      match: password === user.password,
    });

    // Compare passwords directly (without bcrypt)
    if (password !== user.password) {
      console.log("❌ Invalid password for user:", username);
      return res.redirect("/login?error=invalid_credentials");
    }

    // Set session data PROPERLY with all user information
    req.session.login = true;
    req.session.userid = user._id;
    req.session.role = user.role;
    req.session.email = user.email;
    req.session.username = user.username;
    req.session.phone = user.phone || "";
    req.session.pic = user.pic || "";

    // SET NAME PROPERLY - FIXED
    if (user.name && user.name.trim() !== "") {
      req.session.name = user.name;
      req.session.firstName = user.firstName || "";
      req.session.lastName = user.lastName || "";
    } else if (user.firstName && user.lastName) {
      req.session.name = `${user.firstName} ${user.lastName}`.trim();
      req.session.firstName = user.firstName;
      req.session.lastName = user.lastName;
    } else if (user.firstName) {
      req.session.name = user.firstName;
      req.session.firstName = user.firstName;
      req.session.lastName = "";
    } else if (user.lastName) {
      req.session.name = user.lastName;
      req.session.firstName = "";
      req.session.lastName = user.lastName;
    } else if (user.username) {
      req.session.name = user.username;
      req.session.firstName = user.username;
      req.session.lastName = "";
    } else {
      req.session.name = user.email.split("@")[0];
      req.session.firstName = user.email.split("@")[0];
      req.session.lastName = "";
    }

    console.log("✅ Login successful - Session data:", {
      name: req.session.name,
      firstName: req.session.firstName,
      lastName: req.session.lastName,
      role: user.role,
      email: user.email,
      phone: req.session.phone,
    });

    // Save session before redirect
    req.session.save((err) => {
      if (err) {
        console.log("SESSION SAVE ERROR:", err);
        return res.redirect("/login?error=session_error");
      }

      req.session.save((err) => {
        if (err) {
          console.log(err);
          return res.redirect("/login?error=session");
        }

        if (user.role === "Customer") {
          return res.redirect("/customer");
        } else {
          return res.redirect("/admin");
        }
      });
    });
  } catch (error) {
    console.log("❌ Login error:", error);
    res.redirect("/login?error=login_failed");
  }
}

async function logout(req, res) {
  req.session.destroy((error) => {
    if (error) {
      console.log(error);
    } else {
      res.redirect("/admin/user/login");
    }
  });
}

// Secret Super Admin Registration functions
async function secretSuperAdminPage(req, res) {
  const superAdminExists = await User.findOne({ role: "Super Admin" });

  if (superAdminExists) {
    // Instead of redirecting, show message on same page
    return res.render("9tiVhuLQwl7bqF00oGoQ", {
      session: req.session,
      title: "Super Admin Registration",
      errorMessage: { message: "Super Admin already exists." },
      data: {},
      query: req.query,
      success: req.query.success,
    });
  }

  res.render("9tiVhuLQwl7bqF00oGoQ", {
    session: req.session,
    title: "Super Admin Registration",
    errorMessage: {},
    data: {},
    query: req.query,
    success: req.query.success,
  });
}

async function secretSuperAdminStore(req, res) {
  try {
    const {
      firstName,
      lastName,
      email,
      username,
      phone,
      password,
      confirmPassword,
    } = req.body;

    console.log("📝 Secret Super Admin Registration attempt:", {
      firstName,
      lastName,
      email,
      username,
      phone,
    });
    console.log("📸 File uploaded:", req.file ? req.file.filename : "No file");

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email: email }, { username: username }],
    });

    if (existingUser) {
      console.log("❌ User already exists with same email or username:", {
        email,
        username,
      });
      return res.redirect("/9tiVhuLQwl7bqF00oGoQ?error=user_exists");
    }

    // Validate password match
    if (password !== confirmPassword) {
      console.log("❌ Password mismatch");
      return res.redirect("/9tiVhuLQwl7bqF00oGoQ?error=password_mismatch");
    }

    // Create new Super Admin
    const newUser = new User({
      firstName,
      lastName,
      email,
      username,
      phone,
      password,
      role: "Super Admin",
    });

    // Handle profile picture if uploaded
    if (req.file) {
      newUser.pic = req.file.filename;
      console.log("🖼️ Super Admin profile picture saved:", newUser.pic);
    }

    await newUser.save();

    console.log("✅ Super Admin created successfully:", {
      id: newUser._id,
      name: `${firstName} ${lastName}`,
      email: newUser.email,
      username: newUser.username,
      role: newUser.role,
      pic: newUser.pic || "No profile picture",
    });

    // Redirect to form with success message
    res.redirect("/9tiVhuLQwl7bqF00oGoQ?success=true");
  } catch (error) {
    console.error("❌ Super Admin registration error:", error);

    // Handle specific errors
    if (error.code === 11000) {
      return res.redirect("/9tiVhuLQwl7bqF00oGoQ?error=user_exists");
    }

    res.redirect("/9tiVhuLQwl7bqF00oGoQ?error=registration_failed");
  }
}

// Assuming you already have:
// const User = require("../../../models/User"); or similar at top

// ================= ADMIN REGISTER PAGE =================
async function adminRegisterPage(req, res) {
  res.render("registerAdmin", {
    title: "Admin Registration",
    session: req.session,
    query: req.query,
    data: {
      firstName: req.query.firstName || "",
      lastName: req.query.lastName || "",
      email: req.query.email || "",
      username: req.query.username || "",
      phone: req.query.phone || "",
    },
  });
}

// ================= ADMIN REGISTER STORE =================
async function adminRegisterStore(req, res) {
  try {
    // 1) Handle invalid file type from fileFilter
    if (req.fileValidationError === "INVALID_FILE_TYPE") {
      return res.redirect("/register-admin?error=invalid_file_type");
    }

    // 2) Get form data
    const {
      firstName,
      lastName,
      email,
      username,
      phone,
      password,
      confirmPassword,
    } = req.body;

    // 3) Basic validation – password
    if (password !== confirmPassword) {
      return res.redirect(
        `/register-admin?error=password_mismatch&firstName=${encodeURIComponent(firstName || "")}&lastName=${encodeURIComponent(lastName || "")}&email=${encodeURIComponent(email || "")}&username=${encodeURIComponent(username || "")}&phone=${encodeURIComponent(phone || "")}`,
      );
    }

    // 4) Check existing user by email OR username
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return res.redirect(
        `/register-admin?error=user_exists&firstName=${encodeURIComponent(firstName || "")}&lastName=${encodeURIComponent(lastName || "")}&email=${encodeURIComponent(email || "")}&username=${encodeURIComponent(username || "")}&phone=${encodeURIComponent(phone || "")}`,
      );
    }

    // 5) Create new Admin (pic = ONLY filename, SAME as Customer & Super Admin)
    const newAdmin = new User({
      firstName,
      lastName,
      email,
      username,
      phone,
      password,
      role: "Admin",
    });

    if (req.file) {
      newAdmin.pic = req.file.filename; // ⬅️ ONLY filename (e.g. "1764...jpg")
      console.log("🖼️ Admin profile picture saved:", newAdmin.pic);
    }

    await newAdmin.save();

    console.log("✅ Admin created:", {
      id: newAdmin._id,
      email: newAdmin.email,
      username: newAdmin.username,
      pic: newAdmin.pic,
    });

    // 6) Show success on same page
    return res.redirect("/register-admin?success=true");
  } catch (err) {
    console.error("❌ Admin registration error:", err);

    // If multer threw file size error
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.redirect("/register-admin?error=file_too_large");
    }

    return res.redirect("/register-admin?error=registration_failed");
  }
}

// Password 1
async function forgetPassword1(req, res) {
  res.render("forget-password-1", {
    session: req.session,
    title: "Admin Forget Password",
    errorMessage: {},
  });
}

async function forgetPasswordStore1(req, res) {
  try {
    var data = await User.findOne({
      $or: [{ username: req.body.username }, { email: req.body.username }],
    });
    if (data) {
      let otp = Number(
        parseInt(Math.random() * 1000000)
          .toString()
          .padEnd(6, 0),
      );
      data.otp = otp;
      data.otpGenTime = new Date();
      await data.save();

      mailer.sendMail(
        {
          from: process.env.MAIL_SENDER,
          to: data.email,
          subject: "Password Reset OTP : Advance Poly Pathic Pharmaceuticals",
          html: `
  <div style="font-family: Arial, Helvetica, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; background: #f9f9f9;">
      
      <!-- HEADER -->
      <h2 style="color: #00d084; text-align: center; margin-bottom: 10px;">
          Advance Poly Pathic Pharmaceuticals Limited
      </h2>
      <hr style="border: 0; border-top: 1px solid #ddd; margin: 15px 0;">

      <!-- GREETING -->
      <p style="font-size: 16px; color: #333;">
          Dear <strong style="color:#0066cc;">${data.name}</strong>,
      </p>

      <!-- OTP MESSAGE -->
      <p style="font-size: 15px; style="color: #00d084 line-height: 1.6;">
          We have received a request to reset your account password.  
          Please use the OTP below to proceed with resetting your password.
      </p>

      <!-- OTP BOX -->
      <div style="text-align: center; margin: 30px 0;">
          <span style="font-size: 28px; font-weight: bold; letter-spacing: 4px; color: #00d084; background: #eef5ff; padding: 10px 20px; border-radius: 8px; display: inline-block;">
              ${data.otp}
          </span>
      </div>

      <p style="font-size: 14px; color: #555;">
          ⚠️ This OTP is valid for <strong>10 minutes</strong>.  
          If you did not request this password reset, please ignore this email.
      </p>

      <!-- FOOTER -->
      <hr style="margin: 25px 0; border: 0; border-top: 1px solid #ddd;">
      <p style="font-size: 13px; color: #777; text-align: center;">
          © ${new Date().getFullYear()} Advance Poly Pathic Pharmaceuticals Limited.<br>  
          This is an automated message, please do not reply.
      </p>
  </div>
  `,
        },
        (error) => {
          if (error) console.log(error);
        },
      );
      req.session.resetPasswordUser = data.username;
      res.redirect("/forget-password-2");
    } else {
      res.render("forget-password-1", {
        session: req.session,
        title: "Admin Forget Password",
        errorMessage: { username: "Invalid Username or Email Address" },
      });
    }
  } catch (error) {}
}

// Password 2
async function forgetPassword2(req, res) {
  res.render("forget-password-2", {
    session: req.session,
    title: "New Password/OTP",
    errorMessage: {},
  });
}

async function forgetPasswordStore2(req, res) {
  try {
    var data = await User.findOne({
      $or: [
        { username: req.session.resetPasswordUser },
        { email: req.session.resetPasswordUser },
      ],
    });
    if (data) {
      let diff = (new Date(data.otpGenTime) - new Date()) / (1000 * 60);
      if (diff > 10) {
        res.render("forget-password-2", {
          session: req.session,
          title: "Admin Forget Password",
          errorMessage: { otp: "Otp expired" },
        });
      } else if (data.otp == req.body.otp) res.redirect("/forget-password-3");
      else
        res.render("forget-password-2", {
          session: req.session,
          title: "Admin Forget Password",
          errorMessage: { reason: "OTP Not Matched" },
        });
    } else {
      res.render("forget-password-2", {
        session: req.session,
        title: "Admin Forget Password",
        errorMessage: { reason: "User Not Found" },
      });
    }
  } catch (error) {}
}

// Password 3
async function forgetPassword3(req, res) {
  res.render("forget-password-3", {
    session: req.session,
    title: "New Password/OTP",
    errorMessage: {},
  });
}

async function forgetPasswordStore3(req, res) {
  try {
    var data = await User.findOne({
      $or: [
        { username: req.session.resetPasswordUser },
        { email: req.session.resetPasswordUser },
      ],
    });
    if (data) {
      if (req.body.password === req.body.confirmPassword) {
        data.password = req.body.password;
        await data.save();
        res.redirect("/logout");
      } else {
        res.render("forget-password-3", {
          session: req.session,
          title: "Admin Forget Password",
          errorMessage: { password: "Passwords do not match" },
        });
      }
    } else {
      res.render("forget-password-3", {
        session: req.session,
        title: "Admin Forget Password",
        errorMessage: { password: "Unauthorized Activity" },
      });
    }
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  homePage,
  aboutPage,
  featurePage,
  servicePage,
  serviceShowPage,
  allProductPage,
  testimonialPage,
  faqPage,
  offerPage,
  teamPage,
  errorPage,
  contactPage,
  contactStorePage,
  careerPage,
  careerStorePage,
  registerPage,
  registerStore,
  login,
  loginStore,
  logout,
  secretSuperAdminPage,
  secretSuperAdminStore,
  adminRegisterPage,
  adminRegisterStore,
  forgetPassword1,
  forgetPassword2,
  forgetPassword3,
  forgetPasswordStore1,
  forgetPasswordStore2,
  forgetPasswordStore3,
};
