const AdminTeamRouter = require("express").Router()

const {encoder} = require("../../middlewares/bodyParserMiddleware")
const {teamUploader} = require("../../middlewares/multerMiddleware")
const {
    homePage,
    createPage,
    storePage,
    deleteRecord,
    editPage,
    storeUpdatePage
}= require("../../controllers/admin/adminTeamController")

AdminTeamRouter.get("/",homePage)
AdminTeamRouter.get("/create",createPage)
AdminTeamRouter.post("/store",teamUploader.single('pic'),encoder, storePage)
AdminTeamRouter.get("/delete/:_id",deleteRecord)
AdminTeamRouter.get("/edit/:_id",editPage)
AdminTeamRouter.post("/update/:_id",teamUploader.single('pic'),encoder,storeUpdatePage)

module.exports = AdminTeamRouter