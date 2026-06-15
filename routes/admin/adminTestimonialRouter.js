const AdminTestimonialRouter = require("express").Router()

const {encoder} = require("../../middlewares/bodyParserMiddleware")
const {testimonialUploader} = require("../../middlewares/multerMiddleware")
const {
    homePage,
    createPage,
    storePage,
    deleteRecord,
    editPage,
    storeUpdatePage
}= require("../../controllers/admin/adminTestimonialController")

AdminTestimonialRouter.get("/",homePage)
AdminTestimonialRouter.get("/create",createPage)
AdminTestimonialRouter.post("/store",testimonialUploader.single('pic'),encoder, storePage)
AdminTestimonialRouter.get("/delete/:_id",deleteRecord)
AdminTestimonialRouter.get("/edit/:_id",editPage)
AdminTestimonialRouter.post("/update/:_id",testimonialUploader.single('pic'),encoder,storeUpdatePage)

module.exports = AdminTestimonialRouter