const User = require("../../models/User");
const fs = require("fs");
const path = require("path");

async function dashboardPage(req, res) {
  try {
    let data = await User.findOne({ _id: req.session.userid });
    res.render("admin/users/dashboard", {
      session: req.session,
      title: "Admin Dashboard",
      data,
      isSuperAdmin: req.session.role === "Super Admin"
    });
  } catch (error) {
    console.log(error);
    res.redirect("/admin/login");
  }
}

// Get all admin users (Super Admin and Admin only)
async function getAdminUsers(req, res) {
  try {
    if (req.session.role !== 'Super Admin') {
      return res.redirect("/admin?error=unauthorized");
    }

    const adminUsers = await User.find({
      role: { $in: ['Super Admin', 'Admin'] }
    }).sort({ _id: -1 });

    res.render("admin/users/admin-users", {
      session: req.session,
      title: "Admin Users",
      data: adminUsers,
      isSuperAdmin: req.session.role === "Super Admin"
    });
  } catch (error) {
    console.log('Error fetching admin users:', error);
    res.redirect("/admin?error=server_error");
  }
}

// Get all customers
async function getCustomers(req, res) {
  try {
    if (req.session.role !== 'Super Admin') {
      return res.redirect("/admin?error=unauthorized");
    }

    const customers = await User.find({ role: 'Customer' }).sort({ _id: -1 });

    res.render("admin/users/customers", {
      session: req.session,
      title: "Customers",
      data: customers,
      isSuperAdmin: req.session.role === "Super Admin"
    });
  } catch (error) {
    console.log('Error fetching customers:', error);
    res.redirect("/admin?error=server_error");
  }
}

function createPage(req,res){
    res.render("admin/users/create",{
      session:req.session, 
      title:"Admin Team | User",
      errorMessage:{},
      data:{}
    })
}

async function storePage(req,res){
    try {
        if(req.body.password == req.body.confirmPassword){
            var data = new User(req.body);
            
            // Handle isActive field (convert string to boolean)
            data.isActive = req.body.isActive === 'true';
            
            // Add profile picture if uploaded
            if(req.file){
                data.pic = req.file.filename; // Store only the filename
            }
            
            await data.save();
            res.redirect("/admin/user");
        }
        else{
            let errorMessage = {};
            errorMessage['password'] = "Password and Confirm Password Doesn't Match";
            res.render("admin/users/create",{
                session: req.session, 
                title: "Admin | User Member",
                errorMessage,
                data: req.body
            });
        }
    } catch (error) {
        console.log('Error creating user:', error);
        let errorMessage = {};
        // Handle validation errors
        if (error.errors) {
            for (let key in error.errors) {
                errorMessage[key] = error.errors[key].message;
            }
        }
        
        // Handle file upload errors
        if (error.message && error.message.includes('image')) {
            errorMessage['pic'] = 'Invalid image file. Please upload JPEG, PNG, GIF, or WebP images only (max 2MB).';
        }
        
        res.render("admin/users/create",{
            session: req.session, 
            title: "Admin | User Member",
            errorMessage,
            data: req.body
        });
    }
}

async function editPage(req,res){
    try {
        let data = await User.findOne({_id:req.params._id})
        res.render("admin/users/edit",{
          session:req.session, 
          title:"Admin | Member Edit",
          errorMessage:{},
          data:data
        })
    } catch (error) {
        console.log('Error fetching user for edit:', error);
        res.redirect("/admin/user?error=not_found");
    }
}

async function storeUpdatePage(req,res){
    try {
        var data = await User.findOne({_id:req.params._id})
        
        // Update only the fields that exist in your User model
        data.firstName = req.body.firstName || data.firstName;
        data.lastName = req.body.lastName || data.lastName;
        data.username = req.body.username || data.username;
        data.email = req.body.email || data.email;
        data.phone = req.body.phone || data.phone;
        data.role = req.body.role || data.role;
        
        // ADD THIS LINE: Update isActive status (convert string to boolean)
        data.isActive = req.body.isActive === 'true';
        
        // Add profile picture if new one uploaded
        if(req.file){
            // Delete old profile picture if exists
            if(data.pic){
                const oldImagePath = path.join(__dirname, '../../public/uploads/user/', data.pic);
                try {
                    if(fs.existsSync(oldImagePath)) {
                        fs.unlinkSync(oldImagePath);
                    }
                } catch (error) {
                    console.log('Error deleting old profile picture:', error);
                }
            }
            data.pic = req.file.filename; // Store only the filename
        }
        
        // Only update password if provided
        if (req.body.password && req.body.password.trim() !== '') {
            if(req.body.password === req.body.confirmPassword) {
                data.password = req.body.password;
            } else {
                let errorMessage = {};
                errorMessage['password'] = "Password and Confirm Password Doesn't Match";
                return res.render("admin/users/edit",{
                    session: req.session, 
                    title: "Admin | User Member",
                    errorMessage,
                    data: data
                });
            }
        }
        
        await data.save();
        res.redirect("/admin/user");
    } catch (error) {
        console.log('Error updating user:', error);
        let errorMessage = {}
        if (error.errors) {
            for (let key in error.errors) {
                errorMessage[key] = error.errors[key].message;
            }
        }
        
        // Handle file upload errors
        if (error.message && error.message.includes('image')) {
            errorMessage['pic'] = 'Invalid image file. Please upload JPEG, PNG, GIF, or WebP images only (max 2MB).';
        }
        
        res.render("admin/users/edit",{
          session:req.session, 
          title:"Admin | User Member",
          errorMessage,
          data
        })
    }
}

async function deleteRecord(req, res) {
    try {
        let data = await User.findOne({_id: req.params._id})
        
        // Delete profile picture if exists
        if(data && data.pic){
            const imagePath = path.join(__dirname, '../../public/uploads/user/', data.pic);
            try {
                if(fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                }
            } catch (error) {
                console.log('Error deleting user profile picture:', error);
            }
        }
        
        await data.deleteOne();
        res.redirect("/admin/user");
    } catch (error) {
        console.log('Error deleting user:', error);
        res.redirect("/admin/user?error=delete_failed");
    }
}

module.exports = {
    dashboardPage,
    getAdminUsers,
    getCustomers,
    createPage,
    storePage,
    deleteRecord,
    editPage,
    storeUpdatePage
}