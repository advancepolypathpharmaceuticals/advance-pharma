const AdminServiceRouter = require("express").Router()

const {encoder} = require("../../middlewares/bodyParserMiddleware")
const {serviceUploader} = require("../../middlewares/multerMiddleware")
const {
    homePage,
    createPage,
    storePage,
    deleteRecord,
    editPage,
    storeUpdatePage
}= require("../../controllers/admin/adminServiceController")

AdminServiceRouter.get("/",homePage)
AdminServiceRouter.get("/create",createPage)
AdminServiceRouter.post("/store",serviceUploader.single('pic'),encoder, storePage)
AdminServiceRouter.get("/delete/:_id",deleteRecord)
AdminServiceRouter.get("/edit/:_id",editPage)
AdminServiceRouter.post("/update/:_id",serviceUploader.single('pic'),encoder,storeUpdatePage)

module.exports = AdminServiceRouter