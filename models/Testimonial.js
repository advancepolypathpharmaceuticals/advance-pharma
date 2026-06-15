const mongoose = require("mongoose");
const TestimonialSchema = new mongoose.Schema({
    name:{
        type:String,
        required: [true,"Testimonial Name is Mendatory"],
    },
    pic:{
        type:String,
        required: [true,"Testimonial Picture is Mendatory"],
    },
    profession:{
        type:String,
        required: [true,"Testimonial Profession is Mendatory"],
    },
    message:{
        type:String,
        required: [true,"Testimonial Message is Mendatory"],
    }
})
const Testimonial = new mongoose.model("Testimonial",TestimonialSchema)
module.exports = Testimonial