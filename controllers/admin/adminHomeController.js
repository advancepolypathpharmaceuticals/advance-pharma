function homePage(req,res){
    res.render("admin/home/index",{session:req.session, title:"Admin Dashboard"})
}

module.exports = {
    homePage
}