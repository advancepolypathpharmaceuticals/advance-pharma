const AdminCheckoutRouter = require("express").Router()
const {
    checkoutPage,
    applyCoupon,
    removeCoupon,
    placeOrder,
    thankyouPage
} = require("../../controllers/front/checkoutController")

// Checkout routes
AdminCheckoutRouter.get("/checkout", checkoutPage)
AdminCheckoutRouter.post("/apply-coupon", applyCoupon)
AdminCheckoutRouter.post("/remove-coupon", removeCoupon)
AdminCheckoutRouter.post("/place-order", placeOrder)
AdminCheckoutRouter.get("/thankyou", thankyouPage)

module.exports = AdminCheckoutRouter