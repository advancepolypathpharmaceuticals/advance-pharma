const AdminCartRouter = require("express").Router()
const {
    showCart,
    addToCart,
    removeFromCart,
    updateCart,
    showCheckout,
    placeOrder
} = require("../../controllers/admin/adminCartController")

// Cart routes
AdminCartRouter.get("/cart", showCart)
AdminCartRouter.post("/cart/add/:_id", addToCart)
AdminCartRouter.get("/cart/remove/:_id", removeFromCart)
AdminCartRouter.post("/cart/update/:_id", updateCart)

// Checkout routes
AdminCartRouter.get("/checkout", showCheckout)
AdminCartRouter.post("/checkout/place-order", placeOrder)

module.exports = AdminCartRouter

// const express = require("express");
// const router = express.Router();
// const cartController = require("../../controllers/admin/adminCartController");

// // Cart routes
// router.get("/cart", cartController.showCart);
// router.post("/cart/add/:_id", cartController.addToCart);
// router.get("/cart/remove/:_id", cartController.removeFromCart);
// router.post("/cart/update/:_id", cartController.updateCart);

// // Checkout routes
// router.get("/checkout", cartController.showCheckout);
// router.post("/checkout/place-order", cartController.placeOrder);

// // Apply discount route
// router.post("/cart/apply-discount", (req, res) => {
//   try {
//     const { discount, couponCode } = req.body;

//     // Validate discount
//     const discountAmount = parseFloat(discount) || 0;

//     // Store in session
//     req.session.discountAmount = discountAmount;
//     req.session.couponCode = couponCode;

//     res.json({
//       success: true,
//       message: "Discount applied successfully",
//       discount: discountAmount,
//     });
//   } catch (error) {
//     console.error("Error applying discount:", error);
//     res.json({
//       success: false,
//       message: "Error applying discount",
//     });
//   }
// });

// router.post("/cart/clear-discount", (req, res) => {
//   req.session.discountAmount = 0;
//   req.session.couponCode = "";
//   res.json({ success: true, message: "Discount cleared" });
// });

// // Thankyou page
// router.get("/thankyou", (req, res) => {
//   const order = req.session.lastOrder;

//   if (!order) {
//     console.log("No lastOrder found in session, redirecting to cart");
//     return res.redirect("/cart");
//   }

//   // Render page with order data
//   res.render("thankyou", {
//     title: "Thank You - Order Placed",
//     order: order,
//     message: "Your COD order has been placed successfully!",
//   });

// });

// module.exports = router;
