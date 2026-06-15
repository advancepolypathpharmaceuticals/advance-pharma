const Team = require("../../models/Team");
const fs = require("fs")
async function homePage(req,res){
    try {
        let data = await Team.find().sort({_id: -1})
        res.render("admin/teams/index",{session:req.session, title:"Admin Team",data})
    } catch (error) {
        console.log(error)
    }
}
function createPage(req,res){
    res.render("admin/teams/create",{session:req.session, title:"Admin Team | Product",errorMessage:{},data:{}})
}
async function storePage(req,res){
    try {
        var data = new Team(req.body)
        if(req.file){
            data.pic = req.file.path
        }
        await data.save()
        res.redirect("/admin/team")
    } catch (error) {
        // console.log(error)
        let errorMessage ={}
        error.errors.name?errorMessage['name']=error.errors.name.message:"Product Name is Mendatory"
        error.errors.pic?errorMessage['pic']=error.errors.pic.message:"Product Picture is Mendatory"
        error.errors.designation?errorMessage['designation']=error.errors.designation.message:"Member Designation is Mendatory"
        console.log(errorMessage)
        res.render("admin/teams/create",{session:req.session, title:"Admin | Team Member",errorMessage,data})
    }
    
}
async function editPage(req,res){
    try {
        let data = await Team.findOne({_id:req.params._id})
        res.render("admin/teams/edit",{session:req.session, title:"Admin | Member Edit",errorMessage:{},data:data})
    } catch (error) {
        
    }
}
async function storeUpdatePage(req,res){
    try {
        var data = await Team.findOne({_id:req.params._id})
        data.name = req.body.name?req.body.name:data.name
        data.designation = req.body.designation?req.body.designation:data.designation
        data.facebook = req.body.facebook || "";
        data.twitter = req.body.twitter || "";
        data.linkedin = req.body.linkedin || "";
        data.instagram = req.body.instagram || "";
        if(req.file){
            try {
                fs.unlinkSync(data.pic)
            } catch (error) {
                
            }
            data.pic = req.file.path
        }
        await data.save()
        res.redirect("/admin/team")
    } catch (error) {
        // console.log(error)
        let errorMessage ={}
        res.render("admin/teams/edit",{session:req.session, title:"Admin | Team Member",errorMessage:{},data})
    }
    
}
async function deleteRecord(req, res) {
    try {
        let data = await Team.findOne({_id: req.params._id})
        if(data){
        try {
            fs.unlinkSync(data.pic)
        } 
        catch (error) {}
        }
        await data.deleteOne()
        res.redirect("/admin/team")
                
    } catch (error) {
        console.log(error)
               res.redirect("/admin/team") 
            }
}
module.exports = {
    homePage,
    createPage,
    storePage,
    deleteRecord,
    editPage,
    storeUpdatePage
}