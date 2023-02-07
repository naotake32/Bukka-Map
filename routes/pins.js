const router = require("express").Router();
const Pin = require("../models/Pin");

//create a pin
router.post("/",async (req,res)=>{
    console.log("aaaaa");
    const newPin = new Pin(req.body)
    try{
        const savedPin = await newPin.save();
        res.status(200).json(savedPin);
    }catch(err){
        res.status(500).json(err);
    }
})

module.exports = router