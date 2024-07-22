const ENQUIRY = require("../models/enquiry");

const handleCreateEnquiry = async (req, res) => {
  try {
    const enquiry = await ENQUIRY.create(req.body);
    res.status(201).json({ status: "success", enquiry });
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ status: "error", message: "Duplicate key error" });
    } else {
      res.status(500).json({ status: "error", message: error.message });
    }
  }
};

const handleUpdateEnquiry = async (req, res) => {
    const { id } = req.params;
  
    try {
      const updateColor = await ENQUIRY.findOneAndUpdate(
        { _id: id },
        req.body,
        { new: true }
      );
  
      if (updateColor) {
        res.json({
          status: "success",
          message: "Enquiry updated Successfully",
          response: updateColor,
        });
      } else {
        res.json({ status: "error", message: "Enquiry update failed" });
      }
    } catch (error) {
      if (error.code === 11000) {
        res.status(400).json({ status: "error", message: "Duplicate enquiry" });
      } else {
        res.status(500).json({ status: "error", message: error.message });
      }
    }
};

const handleDeleteEnquiry = async (req, res) => {
  const { id } = req.params;
  try {
    const deleteResponse = await ENQUIRY.deleteOne({ _id: id });
    if (deleteResponse) {
      res.json({
        status: "success",
        message: "Enquiry deleted Successfully",
        response: deleteResponse,
      });
    } else {
      res.json({ status: "error", message: "Enquiry deletion failed" });
    }
  } catch (error) {
    throw new Error(error);
  }
};

const handleGetEnquiry = async (req, res) => {
  const { id } = req.params;
  try {
    const response = await ENQUIRY.find({ _id: id });
    if (response.length === 0) {
        return res.json({ status: "error", message: "Enquiry not exists" });
        
    }else if(response.length > 0){
        res.json({
            status: "success",
            response: response,
          });

    } 
    else {
      res.json({ status: "error", message: "Enquiry not exists" });
    }
  } catch (error) {
    throw new Error(error);
  }
};

const handleGetAllEnquiry = async (req, res) => {
  try {
    const response = await ENQUIRY.find();
    res.json({
      status: "success",
      response: response,
    });
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = {
  handleCreateEnquiry,
  handleUpdateEnquiry,
  handleDeleteEnquiry,
  handleGetEnquiry,
  handleGetAllEnquiry,
};
