const AdminHomeRouter = require("express").Router()
const {
    dashboardPage
}= require("../../controllers/admin/adminUserController")

AdminHomeRouter.get("/",dashboardPage)

module.exports = AdminHomeRouter