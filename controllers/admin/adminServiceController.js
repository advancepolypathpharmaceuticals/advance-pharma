const Service = require("../../models/Service");
const fs = require("fs");

async function homePage(req, res) {
    try {
        let data = await Service.find().sort({ _id: -1 });
        res.render("admin/services/index", { session:req.session, title: "Admin Service", data });
    } catch (error) {
        console.log(error);
    }
}

function createPage(req, res) {
    res.render("admin/services/create", { 
        session:req.session, 
        title: "Admin Service | Product", 
        errorMessage: {}, 
        data: {} 
    });
}

async function storePage(req, res) {
    try {
        var data = new Service({
            name: req.body.name,
            shortDescription: req.body.shortDescription,
            price: req.body.price,
            introduction: req.body.introduction,
            uses: req.body.uses,
            benefits: req.body.benefits,
            sideEffects: req.body.sideEffects
        });

        if (req.file) {
            data.pic = req.file.path;
        }

        await data.save();
        res.redirect("/admin/service");
    } catch (error) {
        let errorMessage = {};
        error.keyValue ? errorMessage["name"] = "This Service is Already Created" : "";
        error.errors?.name ? errorMessage["name"] = error.errors.name.message : "Product Name is Mandatory";
        error.errors?.pic ? errorMessage["pic"] = error.errors.pic.message : "Product Picture is Mandatory";
        error.errors?.shortDescription ? errorMessage["shortDescription"] = error.errors.shortDescription.message : "Short Description is Mandatory";
        error.errors?.price ? errorMessage["price"] = error.errors.price.message : "Price is Mandatory";

        res.render("admin/services/create", { 
            session:req.session, 
            title: "Admin Service | Product", 
            errorMessage, 
            data: req.body 
        });
    }
}

async function editPage(req, res) {
    try {
        let data = await Service.findOne({ _id: req.params._id });
        res.render("admin/services/edit", { 
            session:req.session, 
            title: "Admin Service | Product Edit", 
            errorMessage: {}, 
            data 
        });
    } catch (error) {
        console.log(error);
    }
}

async function storeUpdatePage(req, res) {
    try {
        var data = await Service.findOne({ _id: req.params._id });

        data.name = req.body.name || data.name;
        data.shortDescription = req.body.shortDescription || data.shortDescription;
        data.price = req.body.price || data.price;
        data.introduction = req.body.introduction || data.introduction;
        data.uses = req.body.uses || data.uses;
        data.benefits = req.body.benefits || data.benefits;
        data.sideEffects = req.body.sideEffects || data.sideEffects;

        if (req.file) {
            try {
                fs.unlinkSync(data.pic);
            } catch (error) {}
            data.pic = req.file.path;
        }

        await data.save();
        res.redirect("/admin/service");
    } catch (error) {
        let errorMessage = {};
        error.keyValue ? errorMessage["name"] = "This Service is Already Created" : "";
        res.render("admin/services/edit", { 
            session:req.session, 
            title: "Admin Service | Product", 
            errorMessage, 
            data: req.body 
        });
    }
}

async function deleteRecord(req, res) {
    try {
        let data = await Service.findOne({ _id: req.params._id });
        if (data) {
            try {
                fs.unlinkSync(data.pic);
            } catch (error) {}
            await data.deleteOne();
        }
        res.redirect("/admin/service");
    } catch (error) {
        console.log(error);
        res.redirect("/admin/service");
    }
}
// serviceControl.js
async function allProductsPage(req, res) {
  let services = await Service.find({}).sort({_id: -1});
  res.render("allProductPage", { title: "All Products", services });
}


module.exports = {
    homePage,
    createPage,
    storePage,
    deleteRecord,
    editPage,
    storeUpdatePage,
    allProductsPage,
};


// const Service = require("../../models/Service");
// const fs = require("fs")
// async function homePage(req,res){
//     try {
//         let data = await Service.find().sort({_id: -1})
//         res.render("admin/services/index",{session:req.session, title:"Admin Service",data})
//     } catch (error) {
//         console.log(error)
//     }
// }
// function createPage(req,res){
//     res.render("admin/services/create",{session:req.session, title:"Admin Service | Product",errorMessage:{},data:{}})
// }
// async function storePage(req,res){
//     try {
//         var data = new Service(req.body)
//         if(req.file){
//             data.pic = req.file.path
//         }
//         await data.save()
//         res.redirect("/admin/service")
//     } catch (error) {
//         // console.log(error)
//         let errorMessage ={}
//         error.keyValue ? errorMessage['name']= "This Service is Already Created" : ""
//         error.errors.name?errorMessage['name']=error.errors.name.message:"Product Name is Mendatory"
//         error.errors.pic?errorMessage['pic']=error.errors.pic.message:"Product Picture is Mendatory"
//         error.errors.shortDescription?errorMessage['shortDescription']=error.errors.shortDescription.message:"Short Description is Mendatory"
//         error.errors.price?errorMessage['price']=error.errors.price.message:"Price is Mendatory"
//         console.log(errorMessage)
//         res.render("admin/services/create",{session:req.session, title:"Admin Service | Product",errorMessage,data})
//     }
    
// }
// async function editPage(req,res){
//     try {
//         let data = await Service.findOne({_id:req.params._id})
//         res.render("admin/services/edit",{session:req.session, title:"Admin Service | Product Edit",errorMessage:{},data:data})
//     } catch (error) {
        
//     }
// }
// async function storeUpdatePage(req,res){
//     try {
//         var data = await Service.findOne({_id:req.params._id})
//         data.name = req.body.name?req.body.name:data.name
//         data.shortDescription = req.body.shortDescription?req.body.shortDescription:data.shortDescription
//         data.price = req.body.price?req.body.price:data.price
//         if(req.file){
//             try {
//                 fs.unlinkSync(data.pic)
//             } catch (error) {
                
//             }
//             data.pic = req.file.path
//         }
//         await data.save()
//         res.redirect("/admin/service")
//     } catch (error) {
//         // console.log(error)
//         let errorMessage ={}
//         error.keyValue ? errorMessage['name']= "This Service is Already Created" : ""
//         res.render("admin/services/edit",{session:req.session, title:"Admin Service | Product",errorMessage:{},data})
//     }
    
// }
// async function deleteRecord(req, res) {
//     try {
//         let data = await Service.findOne({_id: req.params._id})
//         if(data){
//         try {
//             fs.unlinkSync(data.pic)
//         } 
//         catch (error) {}
//         }
//         await data.deleteOne()
//         res.redirect("/admin/service")
                
//     } catch (error) {
//         console.log(error)
//                res.redirect("/admin/service") 
//             }
// }
// module.exports = {
//     homePage,
//     createPage,
//     storePage,
//     deleteRecord,
//     editPage,
//     storeUpdatePage
// }