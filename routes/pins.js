const router = require("express").Router();
const Pin = require("../models/Pin");

//create a pin
router.post("/",async (req,res)=>{
    console.log("aaaaa")
    const newPin = new Pin(req.body)
    console.log(newPin);
    try{
        const savedPin = await newPin.save();
        res.status(200).json(savedPin);
    }catch(err){
        console.log(err)
        res.status(500).json(err);
    }
})

router.get("/", async (req, res) => {
    console.log("Fetching all pins");
    try {
      const pins = await Pin.find();
      console.log("Pins fetched successfully");
      res.status(200).json(pins);
    } catch (err) {
      console.error("Error fetching pins:", err);
      res.status(500).json(err);
    }
  });

module.exports = router