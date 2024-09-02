const USER = require("../models/user");
const moment = require("moment");
const path = require("path");
const bcrypt = require("bcryptjs");
const sendEmail = require("./emailCtrl");
const crypto = require('crypto');
const { cloudinaryUploadImg } = require("../utils/cloudinary");
const fs = require('fs')


async function handleRegisterNewUser(req, res) {
  const body = req.body;
  const { name, email, password, cpassword ,admin} = body;
  const photo = req.file;

  // console.log({ name, email, password, cpassword ,admin , photo})

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

      //upload - cloudinary
      let imgpath = null;
      if (photo) {
        imgpath = await cloudinaryUploadImg(photo.path, "images");

        // Delete the local file after upload
        fs.unlink(photo.path, (err) => {
          if (err) {
            console.error('Error deleting the local file:', err);
          } else {
            console.log('Local file deleted successfully');
          }
        });
      }
      // console.log(imgpath)
      
      const user = new USER({
        name,
        email,
        password,
        cpassword,
        imgpath,
        role: admin ? 'admin' : 'user',
        date,
      });
      const result = await user.save();
      return res.status(201).json({ status: 201, result });
    }
  } catch (error) {
    return res.status(400).json({ error: error.message });
    
  }
}

async function handleLoginUser(req, res) {
  const body = req.body;
  const { email, password } = body;

  if (!email || !password) {
    return res.status(400).json({ error: "fill all the details" });
  }

  try {
    const isValidUser = await USER.findOne({ email: email });
    
    // if blocked one returned
    if(isValidUser === null){
      return res.status(400).json({
        message : "user not found"
      })
    }

    if (isValidUser.isBlocked === true) {
      return res
        .status(400)
        .json({
          status: 400,
          message: "User is Blocked Can't login, Contact to admin",
        });
    }
    
    if (isValidUser) {
      const isMatch = await bcrypt.compare(password, isValidUser.password);
      // console.log(isMatch)
      if (!isMatch) {
        return res.status(400).json({ error: "Password not matched" });
      } else {
        // generate token
        const token = await isValidUser.generateAuthtoken();
        // console.log(token)

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

// admin login
// async function handleLoginAdmin(req, res) {
//   const body = req.body;
//   const { email, password } = body;

//   if (!email || !password) {
//     return res.status(400).json({ error: "fill all the details" });
//   }

//   try {
//     const isValidUser = await USER.findOne({ email: email });

//     // if blocked one returned
//     if (isValidUser.isBlocked) {
//       return res
//         .status(400)
//         .json({
//           message: "This Admin is Blocked Can't login",
//         });
//     }

//     // check for admin
//     if(isValidUser.role !== 'admin'){
//       return res
//         .status(400)
//         .json({
//           message: "Not an Admin",
//         });
//     }


//     if (isValidUser) {
//       const isMatch = await bcrypt.compare(password, isValidUser.password);
//       if (!isMatch) {
//         return res.status(400).json({ error: "Password not matched" });
//       } else {
//         // generate token
//         const token = await isValidUser.generateAuthtoken();

//         const result = {
//           user: isValidUser,
//           token,
//         };

//         return res.status(201).json({ status: 201, result });
//       }
//     } else {
//       return res.status(400).json({ error: "Account not exist" });
//     }
//   } catch (error) {
//     return res.status(400).json({ error: error.message });
//   }
// }

async function handleLoginAdmin(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Fill all the details" });
  }

  try {
    const isValidUser = await USER.findOne({ email });

    if (!isValidUser) {
      return res.status(400).json({ error: "Account not exist" });
    }

    // Check if the user is blocked
    if (isValidUser.isBlocked) {
      return res.status(400).json({ message: "This Admin is Blocked. Can't login" });
    }

    // Check if the user is an admin
    if (isValidUser.role !== 'admin') {
      return res.status(400).json({ message: "Not an Admin" });
    }

    const isMatch = await bcrypt.compare(password, isValidUser.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Password not matched" });
    }

    // Generate token
    const token = await isValidUser.generateAuthtoken();

    const result = {
      user: isValidUser,
      token,
    };

    return res.status(201).json({ status: 201, result });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}

const handleForgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await USER.findOne({ email: email });
  if (!user) return res.status(400).json({message:"User not found with this email"})
  try {
    const token = await user.createPasswordResetToken();
    await user.save();
    const resetURL = `
  Hi, Please follow this link to reset Your Password. This link is valid till 10 minutes from now.<br/>
  <a href='https://66d565861c630bb9b116aadc--brilliant-vacherin-32e406.netlify.app/reset-password/${token}'>Click Here</a>
`;
// const resetURL = `
// Hi, Please follow this link to reset Your Password. This link is valid till 10 minutes from now.<br/>
// <a href='${process.env.CLIENT_URL}/reset-password/${token}'>Click Here</a>
// `;
    const data = {
      to: email,
      text: resetURL,
      subject: "Forgot Password Link",
      htm: resetURL,
    };
    sendEmail(data);
    res.status(201).json({token , message:"reset password link sent successfully"});
  } catch (error) {
    res.status(500).json(error);
  }
};

// const handleResetPassword = async (req, res) => {
//   const { password } = req.body;
//   const { token } = req.params;
//   const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
//   const user = await USER.findOne({
//     passwordResetToken: hashedToken,
//     passwordResetExpire: { $gt: Date.now() },
//   });
  
//   if (!user) throw new Error(" Token Expired, Please try again later");
//   user.password = password;
//   user.passwordResetToken = undefined;
//   user.passwordResetExpire = undefined;
//   await user.save();
//   res.json({response : user , message:"password reset successfully"});
// };

const handleResetPassword = async (req, res) => {
  try {
    const { password } = req.body;
    const { token } = req.params;

    // Hash the token to match it with the hashed version in the database
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // Find the user based on the hashed token and ensure the token has not expired
    const user = await USER.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpire: { $gt: Date.now() }, // Check if the token has expired
    });

    if (!user) {
      // If no user is found or the token has expired, return an error response
      return res.status(400).json({
        status: 'fail',
        message: 'Token is invalid or has expired. Please request a new password reset.',
      });
    }

    // If the user is found and the token is valid, proceed with password reset
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpire = undefined;
    await user.save();

    res.status(200).json({
      status: 'success',
      message: 'Password reset successfully',
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'An error occurred while resetting the password. Please try again later.',
    });
  }
};





module.exports = {
  handleRegisterNewUser,
  handleLoginUser,
  handleForgotPassword,
  handleResetPassword,
  handleLoginAdmin,
  
};
