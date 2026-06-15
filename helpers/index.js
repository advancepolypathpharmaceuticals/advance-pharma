const hbs = require("hbs")

hbs.registerHelper("dropdownCheck",(selected,option)=>{
    return selected===option?"selected":""
})

hbs.registerHelper("dateHelper",(date)=>{
    return new Date(date).toLocaleString()
})

hbs.registerHelper('eq', function (a, b) {
  return a && b && a.toString() === b.toString();
});

hbs.registerHelper('formatPrice', function(price) {
    if (price === null || price === undefined || price === '') {
        return '₹0.00';
    }
    const num = Number(price);
    if (isNaN(num)) {
        return '₹0.00';
    }
    return '₹' + num.toFixed(2);
});

hbs.registerHelper('isSuperAdmin',(session)=> {
    return session.role==="Super Admin"?true:false
});

hbs.registerHelper('isActive', function(linkPath) {
    return this.currentPath === linkPath ? 'active' : '';
});

hbs.registerHelper("multiply", (a, b) => a * b);

hbs.registerHelper("indexPlusOne", function(index) {
  return index + 1;
});

hbs.registerHelper("userPic", function (pic) {
  if (!pic) {
    return "/img/default-profile.png";
  }

  // If already a full path like "/uploads/user/xxx.jpg"
  if (typeof pic === "string" && pic.startsWith("/uploads/")) {
    return pic;
  }

  // If only filename like "xxx.jpg"
  return "/uploads/user/" + pic;
});

// Status color helper - Updated to match admin panel
hbs.registerHelper('getStatusColor', function(status) {
  const colors = {
    'pending': 'warning',
    'confirmed': 'info',
    'processing': 'primary',
    'shipped': 'secondary',
    'delivered': 'success',
    'cancelled': 'danger'
  };
  return colors[status] || 'secondary';
});

// Payment status color helper
hbs.registerHelper('getPaymentStatusColor', function(status) {
  const colors = {
    'pending': 'warning',
    'paid': 'success',
    'failed': 'danger',
    'refunded': 'info'
  };
  return colors[status] || 'secondary';
});

// Status icon helper - NEW
hbs.registerHelper('getStatusIcon', function(status) {
  const icons = {
    'pending': 'clock',
    'confirmed': 'check-circle',
    'processing': 'cog',
    'shipped': 'shipping-fast',
    'delivered': 'check-double',
    'cancelled': 'times-circle'
  };
  return icons[status] || 'question-circle';
});

// Payment status icon helper - NEW
hbs.registerHelper('getPaymentStatusIcon', function(status) {
  const icons = {
    'pending': 'clock',
    'paid': 'check-circle',
    'failed': 'exclamation-circle',
    'refunded': 'undo'
  };
  return icons[status] || 'question-circle';
});

hbs.registerHelper('capitalize', function(str) {
  if (typeof str === 'string') {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  return str;
});

hbs.registerHelper('gt', (a, b) => a > b);
hbs.registerHelper('add', (a, b) => a + b);
hbs.registerHelper('subtract', (a, b) => a - b);

// const hbs = require("hbs")

// hbs.registerHelper("dropdownCheck",(selected,option)=>{
//     return selected===option?"selected":""
// })

// hbs.registerHelper("dateHelper",(date)=>{
//     return new Date(date).toLocaleString()
// })

// hbs.registerHelper('eq', function (a, b) {
//   return a && b && a.toString() === b.toString();
// });

// hbs.registerHelper('formatPrice', function(price) {
//     if (price === null || price === undefined || price === '') {
//         return '₹0.00';
//     }
//     const num = Number(price);
//     if (isNaN(num)) {
//         return '₹0.00';
//     }
//     return '₹' + num.toFixed(2);
// });

// hbs.registerHelper('isSuperAdmin',(session)=> {
//     return session.role==="Super Admin"?true:false
// });

// hbs.registerHelper('isActive', function(linkPath) {
//     return this.currentPath === linkPath ? 'active' : '';
// });

// hbs.registerHelper("multiply", (a, b) => a * b);

// hbs.registerHelper("indexPlusOne", function(index) {
//   return index + 1;
// });

// hbs.registerHelper('getStatusColor', function(status) {
//   const colors = {
//     'pending': 'warning',
//     'confirmed': 'info',
//     'Packed': 'primary',
//     'shipped': 'secondary',
//     'delivered': 'success',
//     'cancelled': 'danger'
//   };
//   return colors[status] || 'secondary';
// });

// hbs.registerHelper('getPaymentStatusColor', function(status) {
//   const colors = {
//     'pending': 'warning',
//     'paid': 'success',
//     'failed': 'danger',
//     'refunded': 'info'
//   };
//   return colors[status] || 'secondary';
// });

// hbs.registerHelper('capitalize', function(str) {
//   if (typeof str === 'string') {
//     return str.charAt(0).toUpperCase() + str.slice(1);
//   }
//   return str;
// });
// hbs.registerHelper('gt', (a, b) => a > b);
// hbs.registerHelper('add', (a, b) => a + b);
// hbs.registerHelper('subtract', (a, b) => a - b);

// hbs.registerHelper('formatPrice', function(amount) {
//   if (!amount) amount = 0;
//   return '₹' + parseFloat(amount).toFixed(2);
// });

