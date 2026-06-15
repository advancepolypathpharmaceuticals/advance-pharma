const AdminUserRouter = require("express").Router();
const { encoder } = require("../../middlewares/bodyParserMiddleware");
const { userUploader } = require("../../middlewares/multerMiddleware");

const {
    getAdminUsers,
    getCustomers,
    createPage,
    storePage,
    deleteRecord,
    editPage,
    storeUpdatePage
} = require("../../controllers/admin/adminUserController");

// Admin Users Routes
AdminUserRouter.get("/", getAdminUsers);           
AdminUserRouter.get("/customer", getCustomers);  

// User Management Routes
AdminUserRouter.get("/create", createPage);
AdminUserRouter.post("/store", encoder, userUploader.single("pic"), storePage);
AdminUserRouter.get("/edit/:_id", editPage);
AdminUserRouter.post("/update/:_id", encoder, userUploader.single("pic"), storeUpdatePage);
AdminUserRouter.get("/delete/:_id", deleteRecord);

module.exports = AdminUserRouter;