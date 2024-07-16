const USER = require("../models/user");
const moment = require("moment");
const path = require("path");
const bcrypt = require('bcryptjs')

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
      const imgpath = photo
        ? path.relative("./uploads", photo.path).replace(/\\/g, "/")
        : null; // Adjust imgpath

      const user = new USER({
        name,
        email,
        password,
        cpassword,
        imgpath: photo ? imgpath : null,
        date: date,
      });

      const storeData = await user.save();
      return res.status(201).json({ status: 201, storeData });
    }
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}

async function handleLoginUser(req, res) {
  const body = req.body;
  console.log(req.body)
  const { email, password } = body;

  if (!email || !password) {
    return res.status(400).json({ error: "fill all the details" });
  }

  try {
    const isValidUser = await USER.findOne({ email: email });

    // if blocked one returned
    if(isValidUser.isBlocked){
            return res.status(400).json({status:400 , message:"User is Blocked Can't login, Contact to admin"})
    }

    if (isValidUser) {
      const isMatch = await bcrypt.compare(password, isValidUser.password);

      if (!isMatch) {
        return res.status(400).json({ error: "Password not matched" });
      } else {
        // generate token
        const token = await isValidUser.generateAuthtoken();

        const result = {
          user: isValidUser,
          token,
        };

        return res.status(201).json({ status: 201, result });
      }
    } else {
      return res.status(400).json({ error: "Account not exist" });
    }
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}

module.exports = { handleRegisterNewUser, handleLoginUser };
