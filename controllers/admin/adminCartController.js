const Service = require("../../models/Service");
const Order = require("../../models/Order");

// Show cart
function showCart(req, res) {
  const cart = req.session.cart || [];
  const subtotal = cart.reduce(
    (acc, item) => acc + parseFloat(item.price) * parseInt(item.quantity),
    0
  );
  const discount = req.session.discountAmount || 0;
  const shipping = subtotal > 1200 ? 0 : 100;
  const total = subtotal + shipping - discount;

  res.render("cart", {
    title: "Your Cart",
    cart,
    subtotal,
    discount,
    shipping,
    total,
  });
}

// Add to cart
async function addToCart(req, res) {
  try {
    const product = await Service.findById(req.params._id);
    if (!product) return res.redirect("/all-products");

    let cart = req.session.cart || [];
    const quantity = parseInt(req.body.quantity) || 1;
    const itemIndex = cart.findIndex(
      (i) => i._id.toString() === product._id.toString()
    );

    if (itemIndex > -1) {
      cart[itemIndex].quantity += quantity;
    } else {
      cart.push({
        _id: product._id,
        name: product.name,
        price: product.price,
        pic: product.pic,
        quantity,
      });
    }

    req.session.cart = cart;
    res.redirect("/cart");
  } catch (error) {
    console.error(error);
    res.redirect("/all-products");
  }
}

// Remove from cart
function removeFromCart(req, res) {
  let cart = req.session.cart || [];
  cart = cart.filter((i) => i._id.toString() !== req.params._id);
  req.session.cart = cart;
  res.redirect("/cart");
}

// Update cart (AJAX)
function updateCart(req, res) {
  let cart = req.session.cart || [];
  const { quantity } = req.body;
  const id = req.params._id;
  let subtotal = 0;
  let itemTotal = 0;

  cart = cart.map((item) => {
    if (item._id.toString() === id) {
      item.quantity = parseInt(quantity);
      itemTotal = parseFloat(item.price) * item.quantity;
    }
    subtotal += parseFloat(item.price) * item.quantity;
    return item;
  });

  let discount = 0;
  if (req.session.couponCode === "ADVANCE5") {
    discount = subtotal * 0.05;
  }
  const shipping = subtotal > 1200 ? 0 : 100;
  const total = subtotal + shipping - discount;

  req.session.discountAmount = discount;

  req.session.cart = cart;
  res.json({ itemTotal, subtotal, discount, shipping, total });
}

// Show checkout
function showCheckout(req, res) {
  const cart = req.session.cart || [];
  if (cart.length === 0) return res.redirect("/cart?error=empty_cart");

  const subtotal = cart.reduce(
    (acc, item) => acc + parseFloat(item.price) * parseInt(item.quantity),
    0
  );

  // 🚀 Apply shipping rule
  const shipping = subtotal > 1200 ? 0 : 100;

  // Get discount from session
  const discount = req.session.discountAmount || 0;
  const totalAmount = subtotal + shipping - discount;

  res.render("checkout", {
    cart,
    subtotal,
    discount, // Pass discount to template
    shipping,
    totalAmount,
    couponCode: req.session.couponCode || "", // Pass coupon code
    data: req.body || {},
    cartCount: cart.length,
    error: req.query.error,
  });
}

// Place order
async function placeOrder(req, res) {
  try {
    const cart = req.session.cart || [];
    if (cart.length === 0) return res.redirect("/cart");

    const subtotal = cart.reduce(
      (acc, item) => acc + parseFloat(item.price) * parseInt(item.quantity),
      0
    );
    const shipping = subtotal > 1200 ? 0 : 100;
    const discount = req.session.discountAmount || 0;
    const total = subtotal + shipping - discount;

    // Validate required fields
    const requiredFields = [
      "c_fname",
      "c_lname",
      "c_address",
      "c_state_country",
      "c_postal_zip",
      "c_email",
      "c_phone",
    ];
    for (let field of requiredFields) {
      if (!req.body[field] || req.body[field].trim() === "")
        return res.redirect("/checkout?error=missing_fields");
    }

    // Prepare order data
    const orderData = {
      orderNumber:
        "ORD" +
        Date.now().toString().slice(-8) +
        Math.floor(Math.random() * 1000),
      customer: {
        firstName: req.body.c_fname.trim(),
        lastName: req.body.c_lname.trim(),
        email: req.body.c_email.trim(),
        phone: req.body.c_phone.trim(),
        address: req.body.c_address.trim(),
        city: req.body.c_city || "Not specified",
        state: req.body.c_state_country.trim(),
        zipCode: req.body.c_postal_zip.trim(),
        country: "India",
      },
      items: cart.map((item) => ({
        productId: item._id,
        name: item.name,
        price: parseFloat(item.price),
        quantity: parseInt(item.quantity),
        total: parseFloat(item.price) * parseInt(item.quantity),
      })),
      subtotal,
      shipping,
      discount, // Make sure discount is saved to database
      total,
      paymentMethod: req.body.payment_method || "cash_on_delivery",
      paymentStatus: "pending",
      notes: req.body.c_order_notes || "",
      status: "pending",
    };

    const order = await Order.create(orderData);

    // Save last order for thankyou page - CRITICAL FIX
    req.session.lastOrder = {
      orderNumber: order.orderNumber,
      subtotal: order.subtotal,
      discount: order.discount, // Use from saved order
      shipping: order.shipping,
      total: order.total,
      items: order.items,
      paymentMethod: order.paymentMethod,
    };

    // Clear cart & discount
    req.session.cart = [];
    req.session.discountAmount = 0;

    res.redirect("/thankyou");
  } catch (error) {
    console.error("Order placement error:", error);
    res.redirect("/checkout?error=order_failed");
  }
}

module.exports = {
  showCart,
  addToCart,
  removeFromCart,
  updateCart,
  showCheckout,
  placeOrder,
};
