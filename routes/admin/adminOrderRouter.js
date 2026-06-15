const express = require("express");
const router = express.Router();
const orderController = require("../../controllers/admin/adminOrderController");

// Routes
router.get("/", orderController.orderList);              
router.get("/details/:_id", orderController.orderDetails); 
router.post("/update/:_id", orderController.updateOrder);  

module.exports = router;
