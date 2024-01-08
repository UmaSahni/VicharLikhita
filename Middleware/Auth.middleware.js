const jwt = require("jsonwebtoken");
require("dotenv").config

const auth = async(req, res, next) =>{
    const token = req.headers.authorization
    try {
        if(token){
          var decoded = jwt.verify(token.split(" ")[1] , process.env.SECRECT_KEY);
          console.log(decoded)
          req.body.userId = decoded.userId // Relationship
            next()
        }
        else{
            res.status(200).json({msg: "Token did not found"})
        }
    } catch (error) {
        res.status(500).json({msg: "Error in auth middleare", error: error.message})
    }
}

module.exports = {auth}