const mongoose = require("mongoose")

const imageSchema = mongoose.Schema({
   filename:{type:String, required: true},
   name : {type:String, required: true},
   path : {type:String, required: true},
})

const ImageModel = mongoose.model("webimg", imageSchema)

module.exports = {ImageModel}