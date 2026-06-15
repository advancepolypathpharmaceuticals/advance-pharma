const Router = require("express").Router();
const { encoder } = require("../middlewares/bodyParserMiddleware");
const { resumeUploader, userUploader } = require("../middlewares/multerMiddleware"); // Added userUploader
const recaptchaMiddleware = require("../middlewares/recaptchaMiddleware");
const AdminRouter = require("./admin/index");
const AdminCartRouter = require("./admin/adminCartRouter");
const AdminCheckoutRouter = require("./admin/adminCheckoutRouter");
const AdminOrderRouter = require("./admin/adminOrderRouter");

// Frontend controllers
const {
  homePage,
  aboutPage,
  faqPage,
  featurePage,
  offerPage,
  servicePage,
  serviceShowPage,
  allProductPage,
  teamPage,
  testimonialPage,
  contactPage,
  contactStorePage,
  careerPage, 
  careerStorePage,
  // registerPage,
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
} = require("../controllers/front/frontController");

// Import new controllers
const {
    checkoutPage,
    createRazorpayOrder,
    verifyPayment,
    applyCoupon,
    removeCoupon,
    placeOrder,
    thankyouPage
} = require("../controllers/front/checkoutController");

const {
    customerDashboard,
    orderHistory,
    orderDetails,
    customerProfile,
    updateProfile
} = require("../controllers/front/customerController");

// ========== FRONTEND ROUTES ==========
Router.get("/", homePage);
Router.get("/about", aboutPage);
Router.get("/contact", contactPage);
Router.get("/career", careerPage);
Router.post("/career", encoder, resumeUploader.single("resume"),recaptchaMiddleware, careerStorePage);
Router.get("/feature", featurePage);
Router.get("/faq", faqPage);
Router.get("/offer", offerPage);
Router.get("/service", servicePage);
Router.get("/service/:_id", serviceShowPage);
Router.get("/all-products", allProductPage);
Router.get("/team", teamPage);
Router.get("/testimonial", testimonialPage);
Router.post("/contact-us", encoder,recaptchaMiddleware, contactStorePage);


// ========== AUTH ROUTES ==========
// Router.get("/register", registerPage);
Router.post("/register", encoder, userUploader.single("pic"),recaptchaMiddleware, registerStore);
Router.get("/login", login);
Router.post("/login", encoder,recaptchaMiddleware, loginStore);
Router.get("/logout", encoder, logout);
Router.get("/forget-password-1", encoder, forgetPassword1);
Router.get("/forget-password-2", encoder, forgetPassword2);
Router.get("/forget-password-3", encoder, forgetPassword3);
Router.post("/forget-password-1", encoder,recaptchaMiddleware, forgetPasswordStore1);
Router.post("/forget-password-2", encoder,recaptchaMiddleware, forgetPasswordStore2);
Router.post("/forget-password-3", encoder,recaptchaMiddleware, forgetPasswordStore3);

// ========== SECRET SUPER ADMIN REGISTRATION ==========
Router.get("/9tiVhuLQwl7bqF00oGoQ", secretSuperAdminPage);
Router.post("/9tiVhuLQwl7bqF00oGoQ", encoder, userUploader.single("pic"),recaptchaMiddleware, secretSuperAdminStore);
Router.get("/register-admin", adminRegisterPage);
Router.post("/register-admin", encoder, userUploader.single("pic"),recaptchaMiddleware, adminRegisterStore);


// ========== CHECKOUT ROUTES ==========
Router.get("/checkout", checkoutPage);
Router.post("/create-order", createRazorpayOrder);
Router.post("/verify-payment", verifyPayment);
Router.post("/apply-coupon", applyCoupon);
Router.post("/remove-coupon", removeCoupon);
Router.post("/checkout/place-order", encoder,recaptchaMiddleware, placeOrder);
Router.get("/thankyou", thankyouPage);

// ========== CUSTOMER ROUTES ==========
Router.get("/customer", customerDashboard);
Router.get("/customer/orders", orderHistory);
Router.get("/customer/orders/:orderNumber", orderDetails);
Router.get("/customer/profile", customerProfile);
Router.post("/customer/profile/update", encoder, userUploader.single("pic"), updateProfile);

// ========== ADMIN ROUTES ==========
Router.use("/admin", AdminRouter);
Router.use("/", AdminCartRouter);

// 404 fallback
Router.use((req, res) =>
  res.status(404).render("404Page", { title: "404 - Page Not Found" })
);

module.exports = Router;