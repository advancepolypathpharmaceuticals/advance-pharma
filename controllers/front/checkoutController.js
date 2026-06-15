const mailer = require("../../mailer");
const razorpay = require("../../helpers/razorpay");
const Order = require("../../models/Order");
const User = require("../../models/User");
const crypto = require("crypto");

/**
 * Checkout Page - Display checkout form
 */
async function checkoutPage(req, res) {
  try {
    const cart = req.session.cart || [];
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    const subtotal = cart.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );
    const discount = req.session.discount || 0;
    const couponCode = req.session.couponCode || "";

    // If cart is empty, redirect to cart page
    if (cart.length === 0) {
      return res.redirect("/cart?error=empty_cart");
    }

    // Get error message from query parameter
    let errorMessage = {};
    let showError = false;

    if (req.query.error === "account_exists") {
      errorMessage.general =
        "An account with this email or phone number already exists. Please login or continue without creating an account.";
      showError = true;
    } else if (req.query.error === "account_creation_failed") {
      errorMessage.general =
        "Account creation failed. Please try different credentials or continue without creating an account.";
      showError = true;
    } else if (req.query.error === "validation_failed") {
      errorMessage.general = "Please fill in all required fields correctly.";
      showError = true;
    }

    res.render("checkout", {
      session: req.session,
      title: "Checkout - Place Your Order",
      cart,
      cartCount,
      subtotal: subtotal - discount,
      originalSubtotal: subtotal,
      discount,
      couponCode,
      razorpayKey: process.env.RAZORPAY_KEY_ID,
      error: showError ? req.query.error : null,
      errorMessage,
      data: req.session.checkoutData || {},
    });
  } catch (error) {
    console.log("❌ Checkout page error:", error);
    res.redirect("/cart?error=checkout_failed");
  }
}

async function createRazorpayOrder(req, res) {
  try {
    const { amount } = req.body;

    const options = {
      amount: amount * 100, // ₹ to paise
      currency: "INR",
      receipt: "receipt_" + Date.now(),
    };

    const order = await razorpay.orders.create(options);

    res.json({
      success: true,
      order,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false });
  }
}

async function verifyPayment(req, res) {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    orderId
  } = req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expected = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest("hex");

  if (expected === razorpay_signature) {

    await Order.findByIdAndUpdate(orderId, {
      paymentStatus: "paid",
      status: "confirmed"
    });

    return res.json({ success: true });

  } else {
    return res.json({ success: false });
  }
}

/**
 * Apply Coupon - Validate and apply coupon code
 */
async function applyCoupon(req, res) {
  try {
    const { couponCode } = req.body;
    const cart = req.session.cart || [];

    if (cart.length === 0) {
      return res.json({
        success: false,
        message: "Cart is empty",
      });
    }

    const subtotal = cart.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );

    console.log("🔄 Applying coupon:", couponCode, "Subtotal:", subtotal);

    // Simple coupon validation
    const discount = await calculateCouponDiscount(couponCode, subtotal);

    if (discount > 0) {
      // Store in session
      req.session.discount = discount;
      req.session.couponCode = couponCode.toUpperCase();

      console.log("✅ Coupon applied successfully:", {
        code: couponCode,
        discount: discount,
      });

      const shipping = subtotal > 1200 ? 0 : 100;
      const finalTotal = subtotal - discount + shipping;

      res.json({
        success: true,
        discount,
        couponCode: couponCode.toUpperCase(),
        finalTotal,
        message: `Coupon applied successfully! You saved ₹${discount}`,
      });
    } else {
      req.session.discount = 0;
      req.session.couponCode = "";

      res.json({
        success: false,
        message: "Invalid coupon code or order amount too low",
      });
    }
  } catch (error) {
    console.log("❌ Apply coupon error:", error);
    res.json({
      success: false,
      message: "Error applying coupon",
    });
  }
}

/**
 * Remove Coupon - Remove applied coupon
 */
async function removeCoupon(req, res) {
  try {
    req.session.discount = 0;
    req.session.couponCode = "";

    const cart = req.session.cart || [];
    const subtotal = cart.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );
    const shipping = subtotal > 1200 ? 0 : 100;
    const finalTotal = subtotal + shipping;

    res.json({
      success: true,
      discount: 0,
      finalTotal,
      message: "Coupon removed successfully",
    });
  } catch (error) {
    console.log("❌ Remove coupon error:", error);
    res.json({
      success: false,
      message: "Error removing coupon",
    });
  }
}

/**
 * Place Order - Process order placement
 */
async function placeOrder(req, res) {
  try {
    const {
      c_fname,
      c_lname,
      c_companyname,
      c_address,
      c_address2,
      c_city,
      c_state_country,
      c_postal_zip,
      c_email,
      c_phone,
      payment_method,
      c_order_notes,
      createAccount,
      accountPassword,
      c_diff_address,
    } = req.body;

    // Store form data in session in case of errors
    req.session.checkoutData = req.body;

    // Validate required fields
    const requiredFields = {
      c_fname: "First Name",
      c_lname: "Last Name",
      c_address: "Address",
      c_city: "City",
      c_state_country: "State",
      c_postal_zip: "ZIP Code",
      c_email: "Email Address",
      c_phone: "Phone Number",
    };

    let errorMessage = {};
    let hasErrors = false;

    for (let [field, name] of Object.entries(requiredFields)) {
      if (!req.body[field] || req.body[field].trim() === "") {
        errorMessage[field] = `${name} is required`;
        hasErrors = true;
      }
    }

    // Validate email format
    if (c_email && !isValidEmail(c_email)) {
      errorMessage.c_email = "Please enter a valid email address";
      hasErrors = true;
    }

    // Validate phone format
    if (c_phone && !isValidPhone(c_phone)) {
      errorMessage.c_phone = "Please enter a valid phone number";
      hasErrors = true;
    }

    // Check if cart is empty
    const cart = req.session.cart || [];
    if (cart.length === 0) {
      return res.redirect("/checkout?error=empty_cart");
    }

    // If there are validation errors, return to checkout page
    if (hasErrors) {
      const subtotal = cart.reduce(
        (total, item) => total + item.price * item.quantity,
        0,
      );
      const discount = req.session.discount || 0;

      return res.render("checkout", {
        session: req.session,
        title: "Checkout - Place Your Order",
        cart,
        cartCount: cart.reduce((total, item) => total + item.quantity, 0),
        subtotal: subtotal - discount,
        originalSubtotal: subtotal,
        discount,
        couponCode: req.session.couponCode || "",
        error: "validation_failed",
        errorMessage,
        data: req.body,
      });
    }

    // Calculate totals
    const subtotal = cart.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );

    // DEBUG: Check session discount
    console.log("🔍 DEBUG - Session discount:", req.session.discount);
    console.log("🔍 DEBUG - Session couponCode:", req.session.couponCode);

    let discount = req.session.discount || 0;
    const couponCode = req.session.couponCode || "";

    const shipping = subtotal > 1200 ? 0 : 100;
    const total = subtotal - discount + shipping;

    console.log("💰 Final Calculation:");
    console.log("Subtotal:", subtotal);
    console.log("Discount:", discount);
    console.log("Shipping:", shipping);
    console.log("Total:", total);

    let customerUserId = null;
    let customerUsername = "";

    // FIXED: Check if user is already logged in
    if (req.session.login && req.session.userid) {
      // User is already logged in - use their existing ID
      customerUserId = req.session.userid;
      console.log(`✅ Using existing customer ID: ${customerUserId}`);
    }
    // Handle account creation if requested (only for guest users)
    else if (createAccount && accountPassword) {
      try {
        // Check if email or phone already exists
        const existingUser = await User.findOne({
          $or: [{ email: c_email }, { phone: c_phone }],
        });

        if (existingUser) {
          // If user exists, redirect with error parameter
          console.log(`❌ Account already exists: ${existingUser.email}`);

          // Store error in session to display on checkout page
          req.session.checkoutError =
            "An account with this email or phone number already exists. Please login or continue without creating an account.";

          return res.redirect("/checkout?error=account_exists");
        } else {
          // Generate unique username from email
          let baseUsername = c_email.split("@")[0].toLowerCase();
          let username = baseUsername;
          let counter = 1;

          // Ensure username is unique
          while (await User.findOne({ username })) {
            username = `${baseUsername}${counter}`;
            counter++;
          }

          // FIX: Add the required 'name' field
          const customerData = {
            name: `${c_fname} ${c_lname}`.trim(), // Primary name field
            firstName: c_fname,
            lastName: c_lname,
            username: username,
            email: c_email,
            phone: c_phone,
            password: accountPassword,
            role: "Customer",
            address: {
              street: c_address,
              city: c_city,
              state: c_state_country,
              zipCode: c_postal_zip,
            },
          };

          console.log("🔍 Creating user with data:", customerData);

          const newCustomer = new User(customerData);
          await newCustomer.save();
          customerUserId = newCustomer._id;
          customerUsername = username;

          // SET SESSION DATA PROPERLY - FIXED
          req.session.login = true;
          req.session.name = `${c_fname} ${c_lname}`.trim(); // Set name properly
          req.session.userid = newCustomer._id;
          req.session.role = "Customer";
          req.session.customer = true;
          req.session.username = username;
          req.session.email = c_email;

          console.log(`✅ New customer account created: ${newCustomer.email}`);
          console.log("🔐 Session set:", {
            name: req.session.name,
            email: req.session.email,
            role: req.session.role,
          });
        }
      } catch (error) {
        console.log("❌ Customer account creation failed:", error.message);

        // More detailed error logging
        if (error.errors) {
          Object.keys(error.errors).forEach((field) => {
            console.log(`   - ${field}: ${error.errors[field].message}`);
          });
        }

        // Redirect with account creation error
        req.session.checkoutError =
          "Account creation failed. Please try different credentials or continue without creating an account.";
        return res.redirect("/checkout?error=account_creation_failed");
      }
    }

    // Generate order number
    const generateOrderNumber = () => {
      const date = new Date();
      const timestamp = date.getTime().toString().slice(-8);
      const random = Math.floor(Math.random() * 10000)
        .toString()
        .padStart(4, "0");
      return `ORD-${timestamp}${random}`;
    };

    // Create order data - FIXED: Always set customer.userId
    const orderData = {
      orderNumber: generateOrderNumber(),
      customer: {
        userId: customerUserId, // This will be null for guest orders, but set for logged-in users
        firstName: c_fname,
        lastName: c_lname,
        email: c_email,
        phone: c_phone,
      },
      shippingAddress: {
        firstName: c_fname,
        lastName: c_lname,
        company: c_companyname || "",
        address:
          c_diff_address && c_diff_address.trim() !== ""
            ? c_diff_address
            : c_address,
        address2: c_address2 || "",
        city: c_city,
        state: c_state_country,
        zipCode: c_postal_zip,
        email: c_email,
        phone: c_phone,
      },
      items: cart.map((item) => ({
        productId: item._id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.pic,
        total: item.price * item.quantity,
      })),
      subtotal: subtotal,
      discount: {
        amount: discount,
        couponCode: couponCode,
      },
      shipping: shipping,
      total: total,
      paymentMethod: payment_method,
      paymentStatus: req.body.razorpay_payment_id ? "paid" : "pending",
      orderNotes: c_order_notes || "",
    };

    console.log("📦 Creating order with data:", {
      orderNumber: orderData.orderNumber,
      customerUserId: orderData.customer.userId,
      sessionUserId: req.session.userid,
      customerName: `${c_fname} ${c_lname}`,
    });

    // Save order to database
    const order = new Order(orderData);
    await order.save();

    // ================= EMAIL TO CUSTOMER =================
    mailer.sendMail(
      {
        from: process.env.MAIL_SENDER,
        to: c_email,
        subject: "Order Confirmation - Advance Poly Pathic Pharmaceuticals",
        html: `
<div style="font-family: Arial, Helvetica, sans-serif; max-width:650px; margin:auto; padding:20px; border:1px solid #e0e0e0; border-radius:8px; background:#f9f9f9;">
  
  <h2 style="color:#00d084; text-align:center; text-decoration:underline;">
    Advance Poly Pathic Pharmaceuticals Limited
  </h2>

  <p style="font-size:16px;">
    Dear <strong>${c_fname} ${c_lname}</strong>,
  </p>

  <p>Your order has been successfully placed 🎉</p>

  <table style="width:100%; border-collapse:collapse; margin:20px 0;">
    <tr style="background:#f1f1f1;">
      <th style="padding:10px; border:1px solid #ddd;">Order ID</th>
      <td style="padding:10px; border:1px solid #ddd;">${order.orderNumber}</td>
    </tr>
    <tr>
      <th style="padding:10px; border:1px solid #ddd;">Total Amount</th>
      <td style="padding:10px; border:1px solid #ddd;">₹${total}</td>
    </tr>
  </table>

  <h4 style="color:#00d084; text-align:center;">Order Items</h4>

<table style="width:100%; border-collapse:collapse; text-align:center;">
  <thead>
    <tr style="background:#00d084; color:#fff;">
      <th style="padding:10px; border:1px solid #ddd;">Product</th>
      <th style="padding:10px; border:1px solid #ddd;">Qty</th>
      <th style="padding:10px; border:1px solid #ddd;">Price</th>
    </tr>
  </thead>
  <tbody>
    ${order.items
      .map(
        (item) => `
      <tr>
        <td style="padding:10px; border:1px solid #ddd;">${item.name}</td>
        <td style="padding:10px; border:1px solid #ddd;">${item.quantity}</td>
        <td style="padding:10px; border:1px solid #ddd;">₹${item.total}</td>
      </tr>
    `,
      )
      .join("")}
  </tbody>
</table>

<!-- TOTAL SECTION -->
<table style="width:100%; margin-top:20px; border-collapse:collapse;">
  <tr>
    <td style="padding:8px;">Subtotal</td>
    <td style="padding:8px; text-align:right;">₹${subtotal}</td>
  </tr>
  <tr>
    <td style="padding:8px;">Discount</td>
    <td style="padding:8px; text-align:right;">- ₹${discount}</td>
  </tr>
  <tr>
    <td style="padding:8px;">Shipping</td>
    <td style="padding:8px; text-align:right;">₹${shipping}</td>
  </tr>
  <tr style="font-weight:bold; background:#f1f1f1;">
    <td style="padding:10px;">Total</td>
    <td style="padding:10px; text-align:right;">₹${total}</td>
  </tr>
</table>

  <p style="margin-top:20px;">Thank you for choosing us 🙏</p>

  <hr>
  <p style="font-size:12px; text-align:center; color:#777;">
    © ${new Date().getFullYear()} Advance Poly Pathic Pharmaceuticals Limited
  </p>
</div>
`,
      },
      (err) => {
        if (err) console.log("❌ Customer email error:", err);
        else console.log("✅ Customer email sent");
      },
    );

    // ================= EMAIL TO ADMIN =================
    mailer.sendMail(
      {
        from: process.env.MAIL_SENDER,
        to: process.env.MAIL_SENDER,
        subject: "🛒 New Order Received",
        html: `
<div style="font-family: Arial, Helvetica, sans-serif; max-width:650px; margin:auto; padding:20px; border:1px solid #e0e0e0; border-radius:8px; background:#f9f9f9;">
  
  <h2 style="color:#00d084; text-align:center; text-decoration:underline;">
    🛒 New Order Received
  </h2>

  <!-- BASIC INFO -->
  <table style="width:100%; border-collapse:collapse; margin-bottom:20px;">
    <tr style="background:#f1f1f1;">
      <th style="padding:10px; border:1px solid #ddd;">Order ID</th>
      <td style="padding:10px; border:1px solid #ddd;">${order.orderNumber}</td>
    </tr>
    <tr>
      <th style="padding:10px; border:1px solid #ddd;">Customer Name</th>
      <td style="padding:10px; border:1px solid #ddd;">${c_fname} ${c_lname}</td>
    </tr>
    <tr style="background:#f1f1f1;">
      <th style="padding:10px; border:1px solid #ddd;">Email</th>
      <td style="padding:10px; border:1px solid #ddd;">${c_email}</td>
    </tr>
    <tr>
      <th style="padding:10px; border:1px solid #ddd;">Phone</th>
      <td style="padding:10px; border:1px solid #ddd;">${c_phone}</td>
    </tr>
  </table>

  <!-- ✅ SHIPPING ADDRESS (NEW) -->
  <h4 style="color:#00d084; text-align:center;">Shipping Address</h4>

  <table style="width:100%; border-collapse:collapse; margin-bottom:20px;">
    <tr>
      <td style="padding:8px;"><strong>Name:</strong></td>
      <td style="padding:8px;">${c_fname} ${c_lname}</td>
    </tr>
    <tr style="background:#f1f1f1;">
      <td style="padding:8px;"><strong>Address:</strong></td>
      <td style="padding:8px;">
        ${order.shippingAddress.address}, 
        ${order.shippingAddress.address2 || ""}<br>
        ${order.shippingAddress.city}, 
        ${order.shippingAddress.state} - ${order.shippingAddress.zipCode}
      </td>
    </tr>
    <tr>
      <td style="padding:8px;"><strong>Email:</strong></td>
      <td style="padding:8px;">${c_email}</td>
    </tr>
    <tr style="background:#f1f1f1;">
      <td style="padding:8px;"><strong>Phone:</strong></td>
      <td style="padding:8px;">${c_phone}</td>
    </tr>
  </table>

  <!-- PRODUCTS -->
  <h4 style="color:#00d084; text-align:center;">Ordered Products</h4>

  <table style="width:100%; border-collapse:collapse; text-align:center;">
    <thead>
      <tr style="background:#00d084; color:#fff;">
        <th style="padding:10px; border:1px solid #ddd;">Product</th>
        <th style="padding:10px; border:1px solid #ddd;">Quantity</th>
        <th style="padding:10px; border:1px solid #ddd;">Price</th>
      </tr>
    </thead>
    <tbody>
      ${order.items
        .map(
          (item) => `
        <tr>
          <td style="padding:10px; border:1px solid #ddd;">${item.name}</td>
          <td style="padding:10px; border:1px solid #ddd;">${item.quantity}</td>
          <td style="padding:10px; border:1px solid #ddd;">₹${item.total}</td>
        </tr>
      `,
        )
        .join("")}
    </tbody>
  </table>

  <!-- TOTAL -->
  <table style="width:100%; margin-top:20px;">
    <tr>
      <td>Subtotal</td>
      <td style="text-align:right;">₹${subtotal}</td>
    </tr>
    <tr>
      <td>Discount</td>
      <td style="text-align:right;">- ₹${discount}</td>
    </tr>
    <tr>
      <td>Shipping</td>
      <td style="text-align:right;">₹${shipping}</td>
    </tr>
    <tr style="font-weight:bold;">
      <td>Total</td>
      <td style="text-align:right;">₹${total}</td>
    </tr>
  </table>

  <hr>
  <p style="text-align:center; font-size:12px;">
    Admin Notification - ${new Date().toLocaleString()}
  </p>
</div>
`,
      },
      (err) => {
        if (err) console.log("❌ Admin email error:", err);
        else console.log("✅ Admin email sent");
      },
    );

    console.log(`✅ Order placed successfully: ${order.orderNumber}`);
    console.log(`✅ Customer ID in order: ${order.customer.userId}`);

    // Save order data for thankyou page
    req.session.lastOrder = {
      orderNumber: order.orderNumber,
      subtotal: subtotal,
      discount: discount,
      shipping: shipping,
      total: total,
      items: order.items,
      customer: order.customer,
      shippingAddress: order.shippingAddress,
      paymentMethod: order.paymentMethod,
      createdAt: order.createdAt,
      discount: {
        amount: discount,
        couponCode: couponCode,
      },
    };

    // Clear cart and session data
    req.session.cart = [];
    req.session.discount = 0;
    req.session.couponCode = "";
    delete req.session.checkoutData;
    delete req.session.checkoutError; // Clear any previous errors

    // Auto-login only if NEW account was created
    if (customerUserId && !req.session.login) {
      const customer = await User.findById(customerUserId);
      if (customer) {
        req.session.login = true;
        req.session.name = `${customer.firstName} ${customer.lastName}`;
        req.session.userid = customer._id;
        req.session.role = customer.role;
        req.session.customer = true;
        req.session.username = customerUsername;

        console.log(`✅ Auto-login for new customer: ${customer.email}`);
      }
    }

    // Redirect to thankyou page
    res.redirect("/thankyou");
  } catch (error) {
    console.log("❌ Order placement error:", error);

    // Clear temporary session data
    delete req.session.checkoutData;

    res.redirect("/checkout?error=order_failed");
  }
}

/**
 * Thankyou Page - Display order confirmation
 */
async function thankyouPage(req, res) {
  try {
    const order = req.session.lastOrder;

    if (!order) {
      return res.redirect("/service");
    }

    // Clear the last order from session after displaying
    delete req.session.lastOrder;

    res.render("thankyou", {
      session: req.session,
      title: "Thank You - Order Confirmation",
      order,
    });
  } catch (error) {
    console.log("❌ Thankyou page error:", error);
    res.redirect("/");
  }
}

/**
 * Helper: Calculate coupon discount
 */
async function calculateCouponDiscount(couponCode, subtotal) {
  console.log(
    "🔄 Calculating coupon discount for:",
    couponCode,
    "Subtotal:",
    subtotal,
  );

  const couponMap = {
    ADVANCE5: { type: "percentage", value: 5, minOrder: 500 },
    WELCOME10: { type: "percentage", value: 10, minOrder: 1000 },
    FLAT50: { type: "fixed", value: 50, minOrder: 500 },
    FREESHIP: { type: "fixed", value: 100, minOrder: 500 },
    SAVE100: { type: "fixed", value: 100, minOrder: 800 },
    FIRSTORDER: { type: "percentage", value: 15, minOrder: 1500 },
  };

  const coupon = couponMap[couponCode.toUpperCase()];

  if (!coupon) {
    console.log("❌ Coupon not found:", couponCode);
    return 0;
  }

  if (subtotal < coupon.minOrder) {
    console.log(
      "❌ Order amount too low for coupon. Min:",
      coupon.minOrder,
      "Current:",
      subtotal,
    );
    return 0;
  }

  let discount = 0;
  if (coupon.type === "percentage") {
    discount = Math.round((subtotal * coupon.value) / 100);
    console.log(
      `✅ Percentage discount: ${coupon.value}% of ${subtotal} = ${discount}`,
    );
  } else if (coupon.type === "fixed") {
    discount = coupon.value;
    console.log(`✅ Fixed discount: ${discount}`);
  }

  // Ensure discount doesn't exceed subtotal
  if (discount > subtotal) {
    discount = subtotal;
  }

  console.log(`🎉 Final discount for ${couponCode}: ${discount}`);
  return discount;
}

/**
 * Helper: Validate email format
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Helper: Validate phone format (10 digits)
 */
function isValidPhone(phone) {
  phone = phone.replace(/\s+/g, "");
  const phoneRegex = /^(?:\+91|91)?[6-9]\d{9}$/;
  return phoneRegex.test(phone);
}

// Export all functions
module.exports = {
  checkoutPage,
  createRazorpayOrder,
  verifyPayment,
  applyCoupon,
  removeCoupon,
  placeOrder,
  thankyouPage,
};
