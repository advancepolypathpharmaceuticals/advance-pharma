const mongoose = require("mongoose");
const FaqSchema = new mongoose.Schema({
    question:{
        type:String,
        required: [true,"Faq Question is Mendatory"],
    },
    answer:{
        type:String,
        required: [true,"Faq Answer is Mendatory"],
    },
})
const Faq = new mongoose.model("Faq",FaqSchema)
module.exports = Faq