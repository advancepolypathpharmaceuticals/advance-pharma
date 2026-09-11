const mongoose = require("mongoose");

const mongoURI = process.env.MONGODB_URI;

if (!mongoURI) {
    console.error("❌ MONGODB_URI environment variable is not set");
    process.exit(1);
}

mongoose.connect(mongoURI)
    .then(() => console.log("✅ MongoDB connected"))
    .catch(err => {
        console.error("❌ MongoDB connection error:", err);
        process.exit(1);
    });
