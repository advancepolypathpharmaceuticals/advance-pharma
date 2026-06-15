const mongoose = require("mongoose");
const TeamSchema = new mongoose.Schema({
    name:{
        type:String,
        required: [true,"Team Member Name is Mendatory"]
    },
    pic:{
        type:String,
        required: [true,"Product Picture is Mendatory"]
    },
    designation:{
        type:String,
        required: [true,"Team Member Designation is Mendatory"]
    },
    facebook:{
        type:String,
        default:""
    },
    twitter:{
        type:String,
        default:""
    },
    linkedin:{
        type:String,
        default:""
    },
    instagram:{
        type:String,
        default:""
    }
})
const Team = new mongoose.model("Team",TeamSchema)
module.exports = Team