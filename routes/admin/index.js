const AdminRouter = require("express").Router();

const AdminHomeRouter = require("./adminHomeRouter");
const AdminServiceRouter = require("./adminServiceRouter");
const AdminTeamRouter = require("./adminTeamRouter");
const AdminTestimonialRouter = require("./adminTestimonialRouter");
const AdminFaqRouter = require("./adminFaqRouter");
const AdminContactUsRouter = require("./adminContactUsRouter");
const AdminCareerRouter = require("./adminCareerRouter");
const AdminUserRouter = require("./adminUserRouter");  // This should point to your adminUserRouter.js
const AdminOrderRouter = require("./adminOrderRouter");
const AdminCartRouter = require("./adminCartRouter");

const { isLogin, isSuperAdmin } = require("../../middlewares/authenticate");

// Admin routes
AdminRouter.use("/", isLogin, AdminHomeRouter);
AdminRouter.use("/service", isLogin, AdminServiceRouter);
AdminRouter.use("/team", isLogin, AdminTeamRouter);
AdminRouter.use("/testimonial", isLogin, AdminTestimonialRouter);
AdminRouter.use("/faq", isLogin, AdminFaqRouter);
AdminRouter.use("/contact-us", isLogin, AdminContactUsRouter);
AdminRouter.use("/career", isLogin, AdminCareerRouter);
AdminRouter.use("/user", isSuperAdmin, AdminUserRouter);  // This applies isSuperAdmin to all /admin/user routes
AdminRouter.use("/order", isLogin, AdminOrderRouter);

module.exports = AdminRouter;