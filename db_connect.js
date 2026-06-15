// const mongoose = require("mongoose");

// mongoose.connect("mongodb://localhost:27017/pharma")
// .then(() => console.log("✅ MongoDB connected"))
// .catch(err => console.error("❌ MongoDB connection error:", err));

const mongoose = require("mongoose");

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });