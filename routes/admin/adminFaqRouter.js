const AdminFaqRouter = require("express").Router()

const {encoder} = require("../../middlewares/bodyParserMiddleware")
const {
    homePage,
    createPage,
    storePage,
    deleteRecord,
    editPage,
    storeUpdatePage
}= require("../../controllers/admin/adminFaqController")

AdminFaqRouter.get("/",homePage)
AdminFaqRouter.get("/create",createPage)
AdminFaqRouter.post("/store", encoder, storePage)
AdminFaqRouter.get("/delete/:_id",deleteRecord)
AdminFaqRouter.get("/edit/:_id",editPage)
AdminFaqRouter.post("/update/:_id", encoder,storeUpdatePage)

module.exports = AdminFaqRouter