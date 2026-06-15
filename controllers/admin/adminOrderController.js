const Order = require("../../models/Order");
const {
  sendOrderUpdateEmail,
  sendWhatsApp,
} = require("../../helpers/orderNotification");

// ====================== CUSTOMER SIDE ====================== //

// Place order
async function placeOrder(req, res) {
  try {
    const cart = req.session.cart || [];
    if (!cart.length) return res.redirect("/cart");

    const subtotal = cart.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0,
    );
    const shipping = subtotal > 1200 ? 0 : 100;
    const discount = Number(req.session.discountAmount || 0);
    const total = subtotal + shipping - discount;

    // Validate required fields
    const required = [
      "c_fname",
      "c_lname",
      "c_address",
      "c_state_country",
      "c_postal_zip",
      "c_email",
      "c_phone",
    ];
    for (let f of required) {
      if (!req.body[f] || !req.body[f].trim())
        return res.redirect("/checkout?error=missing_fields");
    }

    const order = new Order({
      orderNumber:
        "ORD" +
        Date.now().toString().slice(-8) +
        Math.floor(Math.random() * 1000),
      customer: {
        firstName: req.body.c_fname,
        lastName: req.body.c_lname,
        email: req.body.c_email,
        phone: req.body.c_phone,
      },
      shippingAddress: {
        firstName: req.body.c_fname,
        lastName: req.body.c_lname,
        company: req.body.c_companyname || "",
        address: req.body.c_address,
        address2: req.body.c_address2 || "",
        city: req.body.c_city || "",
        state: req.body.c_state_country,
        zipCode: req.body.c_postal_zip,
        email: req.body.c_email,
        phone: req.body.c_phone,
      },
      items: cart.map((i) => ({
        productId: i._id,
        name: i.name,
        price: i.price,
        quantity: i.quantity,
        image: i.pic || i.image,
        total: i.price * i.quantity,
      })),
      subtotal,
      shipping,
      discount: {
        amount: discount,
        couponCode: req.session.couponCode || "",
      },
      total,
      paymentMethod: req.body.payment_method || "cash_on_delivery",
      paymentStatus: "pending",
      orderNotes: req.body.c_order_notes || "",
      status: "pending",
    });

    await order.save();

    // ================= EMAIL TO CUSTOMER =================
    mailer.sendMail({
      from: process.env.MAIL_SENDER,
      to: order.customer.email,
      subject: "Order Confirmation - Advance Poly Pathic Pharmaceuticals",
      html: `
        <div style="font-family: Arial; padding:20px;">
          <h2 style="color:#00d084;">Order Confirmed ✅</h2>

          <p>Dear <b>${order.customer.firstName}</b>,</p>

          <p>Your order has been successfully placed.</p>

          <h3>Order Details:</h3>
          <p><b>Order ID:</b> ${order.orderNumber}</p>
          <p><b>Total:</b> ₹${order.total}</p>
          <p><b>Payment:</b> ${order.paymentMethod}</p>

          <h4>Items:</h4>
          <ul>
            ${order.items
              .map(
                (i) => `<li>${i.name} (Qty: ${i.quantity}) - ₹${i.total}</li>`,
              )
              .join("")}
          </ul>

          <br>
          <p>Thank you for choosing us 🙏</p>
          <p><b>Advance Poly Pathic Pharmaceuticals</b></p>
        </div>
      `,
    });

    // ================= EMAIL TO ADMIN =================
    mailer.sendMail({
      from: process.env.MAIL_SENDER,
      to: process.env.MAIL_SENDER,
      subject: "🛒 New Order Received",
      html: `
        <h2>New Order</h2>
        <p><b>Order ID:</b> ${order.orderNumber}</p>
        <p><b>Name:</b> ${order.customer.firstName} ${order.customer.lastName}</p>
        <p><b>Email:</b> ${order.customer.email}</p>
        <p><b>Total:</b> ₹${order.total}</p>
      `,
    });

    // Save last order for thankyou page
    req.session.lastOrder = {
      orderNumber: order.orderNumber,
      subtotal: subtotal,
      discount: discount,
      shipping: shipping,
      total: total,
      items: order.items,
      paymentMethod: order.paymentMethod,
    };

    // Clear cart & discount
    req.session.cart = [];
    req.session.discountAmount = 0;
    req.session.couponCode = "";

    res.redirect("/thankyou");
  } catch (err) {
    console.error(err);
    res.redirect("/checkout?error=order_failed");
  }
}

// Get customer orders
async function customerOrders(req, res) {
  try {
    const customerId = req.session.customer?._id;
    if (!customerId) return res.redirect("/customer/login");

    const orders = await Order.find({ "customer.userId": customerId }).sort({
      createdAt: -1,
    });
    res.render("customer/orders", {
      title: "My Orders",
      orders,
      session: req.session,
    });
  } catch (error) {
    console.error(error);
    res.render("customer/orders", {
      title: "My Orders",
      orders: [],
      session: req.session,
    });
  }
}

// ====================== ADMIN SIDE ====================== //

// List all orders - FIXED WITH SAFE HANDLING
async function orderList(req, res) {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });

    // ✅ FIXED: Now using firstName/lastName format consistently
    const formattedOrders = orders.map((order) => {
      return {
        _id: order._id,
        orderNumber: order.orderNumber,
        customer: {
          firstName: order.customer?.firstName || "Customer",
          lastName: order.customer?.lastName || "",
          email: order.customer?.email || "No email",
          phone: order.customer?.phone || "No phone",
        },
        status: order.status || "pending",
        paymentStatus: order.paymentStatus || "pending",
        subtotal: order.subtotal || 0,
        discount: order.discount?.amount || order.discount || 0,
        shipping: order.shipping || 0,
        total: order.total || 0,
        paymentMethod: order.paymentMethod || "cash_on_delivery",
        createdAt: order.createdAt,
        items: order.items || [],
      };
    });

    const orderStats = await getOrderStats();

    res.render("admin/order/list", {
      title: "Order Management",
      orders: formattedOrders,
      orderStats,
      session: req.session,
    });
  } catch (error) {
    console.error("Order list error:", error);
    res.render("admin/order/list", {
      title: "Order Management",
      orders: [],
      orderStats: { total: 0, pending: 0, delivered: 0 },
      session: req.session,
    });
  }
}

// Order details - FIXED WITH CORRECT ADDRESS ACCESS
async function orderDetails(req, res) {
  try {
    const order = await Order.findById(req.params._id);
    if (!order) return res.redirect("/admin/order");

    // ✅ FIXED: Correct address field access
    const formattedOrder = {
      _id: order._id,
      orderNumber: order.orderNumber,
      customer: {
        firstName: order.customer?.firstName || "Customer",
        lastName: order.customer?.lastName || "",
        email: order.customer?.email || "No email",
        phone: order.customer?.phone || "No phone",
      },
      shippingAddress: {
        firstName:
          order.shippingAddress?.firstName ||
          order.customer?.firstName ||
          "Customer",
        lastName:
          order.shippingAddress?.lastName || order.customer?.lastName || "",
        company: order.shippingAddress?.company || "",
        address: order.shippingAddress?.address || "No address",
        address2: order.shippingAddress?.address2 || "",
        city: order.shippingAddress?.city || "No city",
        state: order.shippingAddress?.state || "No state",
        zipCode: order.shippingAddress?.zipCode || "No zip",
        email:
          order.shippingAddress?.email || order.customer?.email || "No email",
        phone:
          order.shippingAddress?.phone || order.customer?.phone || "No phone",
      },
      status: order.status || "pending",
      paymentStatus: order.paymentStatus || "pending",
      subtotal: order.subtotal || 0,
      discount: order.discount?.amount || order.discount || 0,
      shipping: order.shipping || 0,
      total: order.total || 0,
      paymentMethod: order.paymentMethod || "cash_on_delivery",
      createdAt: order.createdAt,
      items: order.items || [],
      orderNotes: order.orderNotes || "",
    };

    res.render("admin/order/details", {
      title: "Order Details - " + order.orderNumber,
      order: formattedOrder,
      session: req.session,
    });
  } catch (error) {
    console.error("Order details error:", error);
    res.redirect("/admin/order");
  }
}

// Update order (status/payment) - FIXED FOR BOTH FORMATS

// async function updateOrder(req, res) {
//   try {
//     const { status, paymentStatus, note } = req.body;
//     const updateData = { updatedAt: new Date() };

//     if (status) updateData.status = status;
//     if (paymentStatus) updateData.paymentStatus = paymentStatus;
//     if (note) updateData.orderNotes = note;

//     await Order.findByIdAndUpdate(req.params._id, updateData);

//     res.json({ success: true, message: "Order updated successfully" });
//   } catch (error) {
//     console.error("Update order error:", error);
//     res.json({ success: false, message: "Error updating order" });
//   }
// }

async function updateOrder(req, res) {
  try {
    const { status, paymentStatus } = req.body;

    console.log("REQ BODY:", req.body);

    const order = await Order.findById(req.params._id);

    if (!order) {
      return res.json({ success: false, message: "Order not found" });
    }

    let isUpdated = false;

    // ✅ ORDER STATUS UPDATE
    if (status !== undefined && status !== order.status) {
      console.log("Order status changed:", order.status, "→", status);
      order.status = status;
      isUpdated = true;
    }

    // ✅ PAYMENT STATUS UPDATE
    if (paymentStatus !== undefined && paymentStatus !== order.paymentStatus) {
      console.log(
        "Payment status changed:",
        order.paymentStatus,
        "→",
        paymentStatus,
      );
      order.paymentStatus = paymentStatus;
      isUpdated = true;
    }

    // ❌ IF NOTHING CHANGED
    if (!isUpdated) {
      return res.json({
        success: false,
        message: "No changes made",
      });
    }

    await order.save();

    // ✅ SEND EMAIL ONLY
    try {
      await sendOrderUpdateEmail(order);
    } catch (err) {
      console.log("Email error:", err);
    }

    // ✅ RETURN UPDATED DATA (VERY IMPORTANT)
    res.json({
      success: true,
      status: order.status,
      paymentStatus: order.paymentStatus,
    });
  } catch (error) {
    console.log("UPDATE ERROR:", error);
    res.json({ success: false });
  }
}

// Order stats - FIXED FOR BOTH FORMATS
async function getOrderStats() {
  try {
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ status: "pending" });
    const deliveredOrders = await Order.countDocuments({ status: "delivered" });

    return {
      total: totalOrders,
      pending: pendingOrders,
      delivered: deliveredOrders,
    };
  } catch (error) {
    console.error("Order stats error:", error);
    return { total: 0, pending: 0, delivered: 0 };
  }
}

// Delete order (admin)
async function deleteOrder(req, res) {
  try {
    await Order.findByIdAndDelete(req.params._id);
    res.json({ success: true, message: "Order deleted successfully" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error deleting order" });
  }
}

// ====================== EXPORT ====================== //
module.exports = {
  placeOrder,
  customerOrders,
  orderList,
  orderDetails,
  updateOrder,
  deleteOrder,
  getOrderStats,
};
