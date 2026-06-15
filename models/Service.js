const mongoose = require("mongoose");
const ServiceSchema = new mongoose.Schema({
    name:{
        type:String,
        required: [true,"Product Name is Mendatory"],
        unique: true
    },
    pic:{
        type:String,
        required: [true,"Product Picture is Mendatory"],
    },
    shortDescription:{
        type:String,
        required: [true,"Product Short Description is Mendatory"],
    },
    price:{
        type:String,
        required: [true,"Product Price is Mendatory"],
    },
    introduction: { type: String },
    uses: { type: String },        
    benefits: { type: String },    
    sideEffects: { type: String }
})
const Service = new mongoose.model("Service",ServiceSchema)
module.exports = Service