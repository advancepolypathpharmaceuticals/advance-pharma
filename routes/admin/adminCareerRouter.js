const AdminCareerRouter = require("express").Router();
const { 
  homePage, 
  editPage, 
  deleteRecord 
} = require("../../controllers/admin/adminCareerController");

// Routes
AdminCareerRouter.get("/", homePage);
AdminCareerRouter.get("/edit/:_id", editPage);
AdminCareerRouter.get("/delete/:_id", deleteRecord);

module.exports = AdminCareerRouter;
