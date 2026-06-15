const AdminContactUsRouter = require("express").Router()

const {encoder} = require("../../middlewares/bodyParserMiddleware")
const {
    homePage,
    deleteRecord,
    editPage,
}= require("../../controllers/admin/adminContactUsController")

AdminContactUsRouter.get("/",homePage)
AdminContactUsRouter.get("/delete/:_id",deleteRecord)
AdminContactUsRouter.get("/edit/:_id",editPage)

module.exports = AdminContactUsRouter