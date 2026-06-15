const Order = require("../../models/Order");
const User = require("../../models/User");
const fs = require("fs");
const path = require("path");

async function customerDashboard(req, res) {
    try {
        if (!req.session.login || req.session.role !== 'Customer') {
            return res.redirect('/login');
        }

        const customer = await User.findById(req.session.userid);
        
        // SIMPLIFIED: Query orders by customer.userId only
        const orders = await Order.find({ 
            'customer.userId': req.session.userid 
        }).sort({ createdAt: -1 });

        console.log('Customer orders found:', orders.length);
        console.log('Customer ID:', req.session.userid);
        
        // Debug: Log order details
        if (orders.length > 0) {
            console.log('Sample order customer IDs:', orders.map(order => order.customer.userId));
        } else {
            console.log('No orders found for customer ID:', req.session.userid);
        }

        // Calculate order stats
        const totalOrders = orders.length;
        const deliveredOrders = orders.filter(order => order.status === 'delivered').length;
        const pendingOrders = orders.filter(order => 
            ['pending', 'confirmed', 'processing', 'shipped'].includes(order.status)
        ).length;

        // Calculate total spent - use the correct field name from your Order model
        const totalSpent = orders.reduce((total, order) => {
            return total + (order.total || 0); // Changed from totalAmount to total
        }, 0);

        res.render("admin/customer/dashboard", {
            session: req.session,
            title: "My Account - Dashboard",
            customer,
            orders,
            recentOrders: orders.slice(0, 5),
            totalOrders,
            deliveredOrders,
            pendingOrders,
            totalSpent,
            formatPrice: (amount) => {
                return new Intl.NumberFormat('en-IN', {
                    style: 'currency',
                    currency: 'INR'
                }).format(amount || 0);
            }
        });
    } catch (error) {
        console.log('Customer dashboard error:', error);
        res.redirect("/login");
    }
}

async function orderHistory(req, res) {
    try {
        if (!req.session.login || req.session.role !== 'Customer') {
            return res.redirect('/login');
        }

        const orders = await Order.find({ 'customer.userId': req.session.userid })
            .sort({ createdAt: -1 });

        // Ensure session has the latest profile picture data
        if (!req.session.pic) {
            const customer = await User.findById(req.session.userid);
            req.session.pic = customer.pic;
        }

        res.render("admin/customer/order-history", {
            session: req.session,
            title: "My Orders - Order History",
            orders,
            formatPrice: (amount) => {
                return new Intl.NumberFormat('en-IN', {
                    style: 'currency',
                    currency: 'INR'
                }).format(amount || 0);
            }
        });
    } catch (error) {
        console.log('Order history error:', error);
        res.redirect("/login");
    }
}

async function orderDetails(req, res) {
    try {
        if (!req.session.login || req.session.role !== 'Customer') {
            return res.redirect('/login');
        }

        const order = await Order.findOne({ 
            orderNumber: req.params.orderNumber,
            'customer.userId': req.session.userid 
        });

        if (!order) {
            return res.redirect('/customer/orders');
        }

        res.render("admin/customer/order-details", {
            session: req.session,
            title: `Order Details - ${order.orderNumber}`,
            order
        });
    } catch (error) {
        console.log('Order details error:', error);
        res.redirect("/customer/orders");
    }
}

async function customerProfile(req, res) {
    try {
        if (!req.session.login || req.session.role !== 'Customer') {
            return res.redirect('/login');
        }

        const customer = await User.findById(req.session.userid);

        // ADD CACHE CONTROL HEADERS
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');

        console.log('🔍 Loading profile for customer:', customer.name); // Debug log

        res.render("admin/customer/profile", {
            session: req.session,
            title: "My Profile",
            customer,
            errorMessage: {},
            success: req.query.success
        });
    } catch (error) {
        console.log('Customer profile error:', error);
        res.redirect("/customer");
    }
}

// UPDATED: Profile picture upload handling
async function updateProfile(req, res) {
  try {
    if (!req.session.login || req.session.role !== 'Customer') {
      return res.redirect('/login');
    }

    const { firstName, lastName, phone, street, city, state, zipCode } = req.body;
    
    console.log('📝 Updating profile with data:', { firstName, lastName, phone, street, city, state, zipCode });
    console.log('📸 File uploaded:', req.file ? req.file.filename : 'No file');
    
    const customer = await User.findById(req.session.userid);
    
    // Update basic fields
    customer.firstName = firstName || customer.firstName;
    customer.lastName = lastName || customer.lastName;
    customer.name = `${firstName} ${lastName}`.trim(); // Update name field
    customer.phone = phone || customer.phone;
    
    // SAFELY update address - handle case where address might be undefined
    customer.address = {
      street: street || (customer.address && customer.address.street) || '',
      city: city || (customer.address && customer.address.city) || '',
      state: state || (customer.address && customer.address.state) || '',
      zipCode: zipCode || (customer.address && customer.address.zipCode) || ''
    };

    // Handle profile picture upload
    if (req.file) {
        console.log('🖼️ New profile picture uploaded:', req.file.filename);
        
        // Delete old profile picture if exists
        if (customer.pic) {
            const oldImagePath = path.join(__dirname, '../../public/uploads/user/', customer.pic);
            try {
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                    console.log('🗑️ Deleted old profile picture:', customer.pic);
                }
            } catch (error) {
                console.log('❌ Error deleting old profile picture:', error);
            }
        }
        
        // Save new profile picture filename
        customer.pic = req.file.filename;
        console.log('✅ Saved new profile picture:', customer.pic);
    }

    await customer.save();

    // UPDATE SESSION DATA PROPERLY
    req.session.name = `${firstName} ${lastName}`.trim();
    req.session.firstName = firstName;
    req.session.lastName = lastName;
    req.session.phone = phone;
    // Update profile picture in session if changed
    if (req.file) {
        req.session.pic = customer.pic;
    }

    console.log('✅ Profile updated for:', req.session.name);
    console.log('📸 Profile picture in session:', req.session.pic);

    res.redirect("/customer/profile?success=true");
  } catch (error) {
    console.log('❌ Update profile error:', error);
    
    // Get fresh customer data for the form
    const customer = await User.findById(req.session.userid);
    
    res.render("admin/customer/profile", {
      session: req.session,
      title: "My Profile",
      customer,
      errorMessage: { general: "Failed to update profile. Please try again." },
      success: false,
      currentTime: new Date().toLocaleString()
    });
  }
}

module.exports = {
    customerDashboard,
    orderHistory,
    orderDetails,
    customerProfile,
    updateProfile
};