const mongoose = require("mongoose");

const CareerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is mandatory"]
    },
    email: {
        type: String,
        required: [true, "Email is mandatory"]
    },
    phone: {
        type: String,
        required: [true, "Phone number is mandatory"]
    },
    position: {
        type: String,
        required: [true, "Position is mandatory"]
    },
    message: {
        type: String,
        required: [true, "Message is mandatory"]
    },
    resume: {
        type: String,
        required: [true, "Resume is mandatory"]
    },
    date: {
        type: Date,
        default: Date.now
    },
    active: {
        type: Boolean,
        default: true
    },
    reviewed: {  // ADD THIS FIELD
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model("Career", CareerSchema);