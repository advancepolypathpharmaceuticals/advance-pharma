const Order = require("../models/Order");

async function injectOrderStats(req, res, next) {
    try {
        if (req.session && req.session.login) {
            const pendingCount = await Order.countDocuments({ status: 'pending' });
            const totalCount = await Order.countDocuments();
            
            res.locals.orderStats = {
                pendingOrders: pendingCount,
                totalOrders: totalCount
            };
        } else {
            res.locals.orderStats = { 
                pendingOrders: 0, 
                totalOrders: 0 
            };
        }
        next();
    } catch (error) {
        console.error("Error injecting order stats:", error);
        res.locals.orderStats = { 
            pendingOrders: 0, 
            totalOrders: 0 
        };
        next();
    }
}

module.exports = injectOrderStats;