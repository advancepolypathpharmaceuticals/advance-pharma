const Faq = require("../../models/Faq");

async function homePage(req,res){
    try {
        let data = await Faq.find().sort({_id: -1})
        res.render("admin/faqs/index",{session:req.session, title:"Admin Faq",data})
    } catch (error) {
        console.log(error)
    }
}
function createPage(req,res){
    res.render("admin/faqs/create",{session:req.session, title:"Admin Faq",errorMessage:{},data:{}})
}
async function storePage(req,res){
    try {
        var data = new Faq(req.body)
        await data.save()
        res.redirect("/admin/faq")
    } catch (error) {
        // console.log(error)
        let errorMessage ={}
        error.errors.question?errorMessage['question']=error.errors.question.message:""
        error.errors.answer?errorMessage['answer']=error.errors.answer.message:""
        console.log(errorMessage)
        res.render("admin/faqs/create",{session:req.session, title:"Admin Faq",errorMessage,data})
    }
    
}
async function editPage(req,res){
    try {
        let data = await Faq.findOne({_id:req.params._id})
        res.render("admin/faqs/edit",{session:req.session, title:"Admin Faq Edit",errorMessage:{},data:data})
    } catch (error) {
        
    }
}
async function storeUpdatePage(req,res){
    try {
        var data = await Faq.findOne({_id:req.params._id})
        data.question = req.body.question?req.body.question:data.question
        data.answer = req.body.answer?req.body.answer:data.answer
        await data.save()
        res.redirect("/admin/faq")
    } catch (error) {
        // console.log(error)
        let errorMessage ={}
        error.keyValue ? errorMessage['question']= "This Faq is Already Created" : ""
        res.render("admin/faqs/edit",{session:req.session, title:"Admin Faq",errorMessage:{},data})
    }
    
}
async function deleteRecord(req, res) {
    try {
        let data = await Faq.findOne({_id: req.params._id})
        await data.deleteOne()
        res.redirect("/admin/faq")
                
    } catch (error) {
        console.log(error)
               res.redirect("/admin/faq") 
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