const USER = require("../models/user");
const bcrypt = require("bcryptjs");

const handleGetUser = async (req, res) => {
  try {
    const validUserOne = await USER.findOne({ _id: req.userid });
    res.status(201).json({ status: 201, validUserOne });
  } catch (error) {
    res.status(401).json({ status: 401, error: error.message });
  }
};

const handleGetAllUsersInfo = async (req, res) => {
  try {
    const users = await USER.find();
    res.status(200).json({ status: 201, users: users });
  } catch (error) {
    res.status(401).json({ status: 401, error: error.message });
  }
};

const handleGetUserInfo = async (req, res) => {
  const id = req.userid;
  try {
    const user = await USER.findOne({ _id: id });
    res.status(200).json({ status: 200, user: user });
  } catch (error) {
    res.status(401).json({ status: 401, error: error.message });
  }
};

const handleDeleteUser = async (req, res) => {
  const id = req.params.id;
  try {
    const response = await USER.deleteOne({ _id: id });
    res.status(200).json({ status: 200, message: response });
  } catch (error) {
    res.status(401).json({ status: 401, error: error.message });
  }
};

const handleUpdateUser = async (req, res) => {
  const id = req.userid;
  const { name, password, cpassword } = req.body;

  try {
    // Check if password and cpassword are provided and match
    if (password && cpassword && password === cpassword) {
      // Hash the new passwords
      const hashedPassword = await bcrypt.hash(password, 10);
      const hashedCpassword = await bcrypt.hash(cpassword, 10);

      // Update the user document with hashed passwords
      const response = await USER.findByIdAndUpdate(
        { _id: id },
        { name, password: hashedPassword, cpassword: hashedCpassword }
      );

      // Check if the user was found and updated
      if (!response) {
        return res.status(404).json({ error: "User not found" });
      }

      res
        .status(200)
        .json({ status: 200, message: "User updated successfully" });
    } else {
      // Handle case where passwords don't match or are not provided
      return res.status(400).json({ error: "Passwords do not match" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const handleBlockUser = async (req, res) => {
  const id = req.params.id;
  try {
    const response = await USER.findByIdAndUpdate(
      { _id: id },
      { isBlocked: true },
      { new: true } // returns the updated document
    );

    if (!response) {
      return res.status(404).json({ status: 404, message: "User not found" });
    }

    res.status(200).json({ status: 200, message: "User blocked successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
const handleUnblockUser = async (req, res) => {
  const id = req.params.id;
  try {
    const response = await USER.findByIdAndUpdate(
      { _id: id },
      { isBlocked: false },
      { new: true } // returns the updated document
    );

    if (!response) {
      return res.status(404).json({ status: 404, message: "User not found" });
    }

    res
      .status(200)
      .json({ status: 200, message: "User UnBlocked successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const handleLogout = async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((elem) => {
      return elem.token !== req.token;
    });

    req.user.save();
    res.status(200).json({ status: 200 , message: "logout successfully"});
  } catch (error) {
    res.status(401).json({ status: 401, error: error.message });
  }
};

module.exports = {
  handleGetUser,
  handleGetAllUsersInfo,
  handleGetUserInfo,
  handleDeleteUser,
  handleUpdateUser,
  handleBlockUser,
  handleUnblockUser,
  handleLogout,
};
