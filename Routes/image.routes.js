const express = require("express")
const { ImageModel } = require("../model/image.model")
const multer = require('multer');
const path = require('path');

const imageRouter = express.Router()


// <------- Multer SetUP --------->

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './Images/')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix  + path.extname(file.originalname))
  }
})

const upload = multer({ storage: storage })



imageRouter.post("/upload", upload.single('image')  ,async(req, res)=>{
    const {name} = req.body
    console.log(req.file)
    const filename = req.file ? req.file.filename : null
    const path = req.file ?  req.file.destination : null
    console.log(req.file)
    
    try {
        const newImage = new ImageModel({filename, name, path})
        await newImage.save()
        res.status(200).json({msg:`${filename} image uploaded success`, success:true})
    } catch (error) {
         res.status(500).json({msg:`${filename} NOT uploaded`, success:false})
    }
})

imageRouter.get("/image/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const img = await ImageModel.findById(id);

        if (!img) {
            return res.status(404).json({ msg: "Image not found", success: false });
        }

        const imagePath = path.join(__dirname, 'Images', img.filename);
        res.sendFile(imagePath);

    } catch (error) {
        res.status(500).json({ msg: `Image NOT Found`, success: false });
    }
});

module.exports = {imageRouter}