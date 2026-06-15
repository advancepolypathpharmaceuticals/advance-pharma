const Testimonial = require("../../models/Testimonial");
const fs = require("fs")
async function homePage(req,res){
    try {
        let data = await Testimonial.find().sort({_id: -1})
        res.render("admin/testimonials/index",{session:req.session, title:"Admin Testimonial",data})
    } catch (error) {
        console.log(error)
    }
}
function createPage(req,res){
    res.render("admin/testimonials/create",{session:req.session, title:"Admin Testimonial | Product",errorMessage:{},data:{}})
}
async function storePage(req,res){
    try {
        var data = new Testimonial(req.body)
        if(req.file){
            data.pic = req.file.path
        }
        await data.save()
        res.redirect("/admin/testimonial")
    } catch (error) {
        // console.log(error)
        let errorMessage ={}
        error.errors.name?errorMessage['name']=error.errors.name.message:"Product Name is Mendatory"
        error.errors.pic?errorMessage['pic']=error.errors.pic.message:"Product Picture is Mendatory"
        error.errors.profession?errorMessage['profession']=error.errors.profession.message:"Profession is Mendatory"
        error.errors.message?errorMessage['message']=error.errors.message.message:"Message is Mendatory"
        console.log(errorMessage)
        res.render("admin/testimonials/create",{session:req.session, title:"Admin Testimonial | Product",errorMessage,data})
    }
    
}
async function editPage(req,res){
    try {
        let data = await Testimonial.findOne({_id:req.params._id})
        res.render("admin/testimonials/edit",{session:req.session, title:"Admin Testimonial | Product Edit",errorMessage:{},data:data})
    } catch (error) {
        
    }
}
async function storeUpdatePage(req,res){
    try {
        var data = await Testimonial.findOne({_id:req.params._id})
        data.name = req.body.name?req.body.name:data.name
        data.profession = req.body.profession?req.body.profession:data.profession
        data.message = req.body.message?req.body.message:data.message
        if(req.file){
            try {
                fs.unlinkSync(data.pic)
            } catch (error) {
                
            }
            data.pic = req.file.path
        }
        await data.save()
        res.redirect("/admin/testimonial")
    } catch (error) {
        // console.log(error)
        let errorMessage ={}
        error.keyValue ? errorMessage['name']= "This testimonial is Already Created" : ""
        res.render("admin/testimonials/edit",{session:req.session, title:"Admin testimonial | Product",errorMessage:{},data})
    }
    
}
async function deleteRecord(req, res) {
    try {
        let data = await Testimonial.findOne({_id: req.params._id})
        if(data){
        try {
            fs.unlinkSync(data.pic)
        } 
        catch (error) {}
        }
        await data.deleteOne()
        res.redirect("/admin/testimonial")
                
    } catch (error) {
        console.log(error)
               res.redirect("/admin/testimonial") 
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