const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const SECRET_KEY = "anurag053";
const crypto = require("crypto");

// mdbgum - snnipet
// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      // unique: true,
      // index: true,
      trim: true, // remove left right extra spaces
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true, // remove left right extra spaces
    },
    password: {
      type: String,
      required: true,
    },
    cpassword: {
      type: String,
      required: true,
    },
    imgpath: {
      type: String,
      default: null,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
    role: {
      type: String,
      default: "user",
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    cart: {
      type: Array,
      default: [],
    },
    address: [{ type: mongoose.Schema.Types.ObjectId, ref: "Address" }],
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],

    passwordChangeAt: Date,
    passwordResetToken: String,
    passwordResetExpire: Date,
  },
  { timestamps: true }
);

// hash pasword , middleware which runs before save operation is performed
userSchema.pre("save", async function (next) {
  if (this.isModified("password") || this.isNew) {
    this.password = await bcrypt.hash(this.password, 10);
    this.cpassword = await bcrypt.hash(this.cpassword, 10);
  }

  next();
});

// add methods generateAuthtoken
userSchema.methods.generateAuthtoken = async function () {
  try {
    let token = jwt.sign({ _id: this._id }, SECRET_KEY, {
      expiresIn: "1d",
    });

    this.tokens = this.tokens.concat({ token: token });
    await this.save();
    return token;
  } catch (error) {
    throw new Error("Error in generating token");
  }
};

//

userSchema.methods.createPasswordResetToken = async function () {
  const resettoken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resettoken)
    .digest("hex");
  this.passwordResetExpire = Date.now() + 30 * 60 * 1000; // 10 minutes
  return resettoken;
};

const USER = mongoose.model("User", userSchema);

//Export the model
module.exports = USER;
