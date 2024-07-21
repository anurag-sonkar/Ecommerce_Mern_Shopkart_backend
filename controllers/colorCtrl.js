const COLOR = require("../models/color");

const handleCreateColor = async (req, res) => {
  try {
    const color = await COLOR.create(req.body);
    res.status(201).json({ status: "success", color });
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ status: "error", message: "Duplicate key error" });
    } else {
      res.status(500).json({ status: "error", message: error.message });
    }
  }
};

const handleUpdateColor = async (req, res) => {
    const { id } = req.params;
  
    try {
      const updateColor = await COLOR.findOneAndUpdate(
        { _id: id },
        req.body,
        { new: true }
      );
  
      if (updateColor) {
        res.json({
          status: "success",
          message: "Color updated Successfully",
          response: updateColor,
        });
      } else {
        res.json({ status: "error", message: "Color update failed" });
      }
    } catch (error) {
      if (error.code === 11000) {
        res.status(400).json({ status: "error", message: "Duplicate color" });
      } else {
        res.status(500).json({ status: "error", message: error.message });
      }
    }
};

const handleDeleteColor = async (req, res) => {
  const { id } = req.params;
  try {
    const deleteResponse = await COLOR.deleteOne({ _id: id });
    if (deleteResponse) {
      res.json({
        status: "success",
        message: "Color deleted Successfully",
        response: deleteResponse,
      });
    } else {
      res.json({ status: "error", message: "Color deletion failed" });
    }
  } catch (error) {
    throw new Error(error);
  }
};

const handleGetColor = async (req, res) => {
  const { id } = req.params;
  try {
    const response = await COLOR.find({ _id: id });
    if (response.length === 0) {
        return res.json({ status: "error", message: "Color not exists" });
        
    }else if(response.length > 0){
        res.json({
            status: "success",
            response: response,
          });

    } 
    else {
      res.json({ status: "error", message: "Color not exists" });
    }
  } catch (error) {
    throw new Error(error);
  }
};

const handleGetAllColor = async (req, res) => {
  try {
    const response = await COLOR.find();
    res.json({
      status: "success",
      response: response,
    });
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = {
  handleCreateColor,
  handleUpdateColor,
  handleDeleteColor,
  handleGetColor,
  handleGetAllColor,
};
