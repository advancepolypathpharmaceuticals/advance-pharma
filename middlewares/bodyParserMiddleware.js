const parser = require("body-parser")
const encoder = new parser.urlencoded({extended: false})

module.exports = {encoder}