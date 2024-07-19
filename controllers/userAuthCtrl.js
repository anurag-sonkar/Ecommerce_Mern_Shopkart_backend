const USER = require("../models/user");
const moment = require("moment");
const path = require("path");
const bcrypt = require("bcryptjs");
const sendEmail = require("./emailCtrl");
const crypto = require('crypto')

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
  console.log(req.body);
  const { email, password } = body;

  if (!email || !password) {
    return res.status(400).json({ error: "fill all the details" });
  }

  try {
    const isValidUser = await USER.findOne({ email: email });

    // if blocked one returned
    if (isValidUser.isBlocked) {
      return res
        .status(400)
        .json({
          status: 400,
          message: "User is Blocked Can't login, Contact to admin",
        });
    }
    console.log(isValidUser)
    if (isValidUser) {
      const isMatch = await bcrypt.compare(password, isValidUser.password);
      console.log(isMatch)
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

const handleForgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await USER.findOne({ email: email });
  if (!user) throw new Error("User not found with this email");
  try {
    const token = await user.createPasswordResetToken();
    await user.save();
    const resetURL = `Hi, Please follow this link to reset Your Password. This link is valid till 10 minutes from now. <a href='http://localhost:8000/auth/reset-password/${token}'>Click Here</>`;
    const data = {
      to: email,
      text: resetURL,
      subject: "Forgot Password Link",
      htm: resetURL,
    };
    sendEmail(data);
    res.json(token);
  } catch (error) {
    res.status(500).json(error);
  }
};

const handleResetPassword = async (req, res) => {
  const { password } = req.body;
  const { token } = req.params;
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  const user = await USER.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpire: { $gt: Date.now() },
  });
  
  if (!user) throw new Error(" Token Expired, Please try again later");
  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpire = undefined;
  await user.save();
  res.json(user);
};

module.exports = {
  handleRegisterNewUser,
  handleLoginUser,
  handleForgotPassword,
  handleResetPassword,
};
