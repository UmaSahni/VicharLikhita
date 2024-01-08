const mongoose = require("mongoose")

const noteSchema = mongoose.Schema({
    title : {type:String, required:true},
    description : {type:String},
    userId : {type:String, required:true},
    tags : {type:Array},
    isPrivate:{type:Boolean, required:true, default:false},
    imageUrl: { type: String }
}, {
    versionKey:false
})

const NotesModel = mongoose.model("notes", noteSchema)

module.exports = {NotesModel}