const USER = require('../models/user')
const moment = require("moment");
const path = require('path')
async function handleRegisterNewUser(req, res) {
    const body = req.body;
    const { name, email, password, cpassword } = body;
    const photo = req.file;
    
    if (!name || !email || !password || !cpassword) {
      return res.status(400).json({ error: "fill all the details" });
    }
  
    try {
      const preUser = await USER.findOne({ email: email });
      if (preUser) {
        return res.status(400).json({ error: "Email Already Exist" });
      } else if (password !== cpassword) {
        return res
          .status(400)
          .json({ error: "Password and Confirm Password Not Match" });
      } else {
          const date = moment(new Date()).format("YYYY-MM-DD");
          const imgpath = photo ? path.relative('./uploads', photo.path).replace(/\\/g, '/') : null; // Adjust imgpath
          
        const user = new USER({
          name,
          email,
          password,
          cpassword,
          imgpath: photo ? imgpath : null,
          date: date,
        });
  
        const storeData = await user.save();
        return res.status(201).json(storeData)
  
        // here password hashing
        // const storeData = await user.save();
        // return res.status(201).json({ status: 201, storeData });
      }
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }


module.exports = {handleRegisterNewUser}