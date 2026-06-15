const ContactUs = require("../../models/ContactUs");
const mailer = require("../../mailer")
async function homePage(req,res){
    try {
        let data = await ContactUs.find().sort({_id: -1})
        res.render("admin/contactus/index",{session:req.session, title:"Admin Contact Us",data})
    } catch (error) {
        console.log(error)
    }
}

async function editPage(req,res){
    try {
        let data = await ContactUs.findOne({_id:req.params._id})
        if(data){
            data.active = false
            await data.save()
            mailer.sendMail({
            from:process.env.MAIL_SENDER,
            to:data.email,
             subject: "Your Query Has Been Resolved – Advance Poly Pathic Pharmaceuticals",
                html: `
                        <div style="font-family: Arial, Helvetica, sans-serif; max-width: 650px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; background: #f9f9f9;">
                            
                            <h2 style="color: #00d084; text-align: center; margin-bottom: 20px; text-decoration: underline;">
                                Query Resolved Confirmation
                            </h2>
        
                            <p style="font-size: 16px; color: #333;">
                                Dear <strong style="color:#0066cc;">${data.name}</strong>,
                            </p>
        
                            <p style="font-size: 15px; color: #333; line-height: 1.6;">
                                We are pleased to inform you that your query regarding 
                                <strong style="color:#0066cc;>"${data.subject}"</strong> has been successfully resolved.  
                                Our team has carefully reviewed your concern and taken the necessary action.
                            </p>
        
                            <p style="font-size: 15px; color: #333; line-height: 1.6;">
                                If you have any further questions or face additional issues, please do not hesitate to contact us again.
                                We are always here to support you.
                            </p>
        
                            <hr style="margin: 30px 0; border: 0; border-top: 1px solid #ddd;">
        
                            <p style="font-size: 15px; color: #333; margin-top: 30px;">
                                Best Regards, <br>
                                <strong style="color:#00d084;">© ${new Date().getFullYear()} Advance Poly Pathic Pharmaceuticals Limited.</strong>
                            </p>
                        </div>
                        `
            },(error)=>{
            if(error)
                console.log(error)
        })
        }
        res.redirect("/admin/contact-us")
    } catch (error) {
         
    }
}

async function deleteRecord(req, res) {
    try {
        let data = await ContactUs.findOne({_id: req.params._id})
        await data.deleteOne()
        res.redirect("/admin/contact-us")
                
    } catch (error) {
        console.log(error)
            }
}
module.exports = {
    homePage,
    deleteRecord,
    editPage,
}