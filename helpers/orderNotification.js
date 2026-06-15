const mailer = require("../mailer");
const axios = require("axios");

// ================= ORDER STATUS DESIGN =================
function getStatusDesign(status) {
  const map = {
    pending: { color: "#ffc107", text: "⏳ Pending" },
    confirmed: { color: "#17a2b8", text: "✅ Confirmed" },
    processing: { color: "#007bff", text: "⚙️ Processing" },
    shipped: { color: "#6c757d", text: "🚚 Shipped" },
    delivered: { color: "#28a745", text: "📦 Delivered" },
    cancelled: { color: "#dc3545", text: "❌ Cancelled" },
  };
  return map[status] || { color: "#000", text: status };
}

// ================= PAYMENT STATUS DESIGN =================
function getPaymentDesign(status) {
  const map = {
    pending: { color: "#ffc107", text: "⏳ Payment Pending" },
    paid: { color: "#28a745", text: "💰 Paid" },
    failed: { color: "#dc3545", text: "❌ Failed" },
    refunded: { color: "#17a2b8", text: "🔄 Refunded" },
  };
  return map[status] || { color: "#000", text: status };
}

// ================= EMAIL FUNCTION =================
async function sendOrderUpdateEmail(order) {
  const orderStatus = getStatusDesign(order.status);
  const paymentStatus = getPaymentDesign(order.paymentStatus);

  const html = `
  <div style="font-family:Arial;padding:20px;">
    
    <h2 style="color:#00d084;">Order Update</h2>

    <p>Hello <b>${order.customer.firstName}</b>,</p>

    <p>Your order has been updated:</p>

    <h3 style="color:${orderStatus.color}">
      📦 Order: ${orderStatus.text}
    </h3>

    <h3 style="color:${paymentStatus.color}">
      💳 Payment: ${paymentStatus.text}
    </h3>

    <hr>

    <p><b>Order ID:</b> ${order.orderNumber}</p>
    <p><b>Total:</b> ₹${order.total}</p>

    <h4>Items:</h4>
    ${order.items.map(item => `
      <div style="display:flex;align-items:center;margin-bottom:10px;">
        <img src="${item.image}" width="60" style="margin-right:10px;border-radius:5px;" />
        <div>
          ${item.name}<br>
          Qty: ${item.quantity} | ₹${item.total}
        </div>
      </div>
    `).join("")}

    <br>
    <p>Thank you 🙏</p>
  </div>
  `;

  await mailer.sendMail({
    from: process.env.MAIL_SENDER,
    to: order.customer.email,
    subject: `Order ${order.orderNumber} - ${orderStatus.text} | ${paymentStatus.text}`,
    html
  });
}

// ================= WHATSAPP FUNCTION =================
async function sendWhatsApp(order) {
  const msg = `🛒 Order Update

Order ID: ${order.orderNumber}
Order Status: ${order.status.toUpperCase()}
Payment Status: ${order.paymentStatus.toUpperCase()}

Amount: ₹${order.total}

Thank you 🙏`;

  await axios.get("https://api.callmebot.com/whatsapp.php", {
    params: {
      phone: order.customer.phone,
      text: msg,
      apikey: process.env.WHATSAPP_API_KEY
    }
  });
}

module.exports = {
  sendOrderUpdateEmail,
  sendWhatsApp
};