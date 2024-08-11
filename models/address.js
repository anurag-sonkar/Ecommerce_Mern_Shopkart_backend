const mongoose = require("mongoose");
const USER = require("./path-to-your-user-model"); // Adjust the path to your User model

const addressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  details: [
    {
      firstname: {
        type: String,
        default: async function () {
          const user = await USER.findById(this.user);
          if (user && user.name) {
            const nameParts = user.name.split(" ");
            return nameParts[0]; // First part of the name as firstname
          }
          return "";
        },
      },
      lastname: {
        type: String,
        default: async function () {
          const user = await USER.findById(this.user);
          if (user && user.name) {
            const nameParts = user.name.split(" ");
            return nameParts[1] || ""; // Second part of the name as lastname, or empty if not present
          }
          return "";
        },
      },
      email: {
        type: String,
        default: async function () {
          const user = await USER.findById(this.user);
          return user ? user.email : "";
        },
      },
      phone: {
        type: Number,
        required: true,
      },
      address: {
        line: {
          type: String,
          required: true,
        },
        city: {
          type: String,
          required: true,
        },
        state: {
          type: String,
          required: true,
        },
        zipcode: {
          type: Number,
          required: true,
        },
      },
    },
  ],
});

const ADDRESS = mongoose.model("Address", addressSchema);

module.exports = ADDRESS;
