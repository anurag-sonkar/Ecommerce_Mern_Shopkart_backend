const BLOG_CATEGORY = require("../models/blogCategory");

const handleCreateBlogCategory = async (req, res) => {
  try {
    const category = await BLOG_CATEGORY.create(req.body);
    res.status(201).json({ status: "success", response : category , message:"blog category created successfully"});
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
    
  }
};

const handleUpdateBlogCategory = async (req, res) => {
  const { id } = req.params;
  try {
    const updateBlogCategory = await BLOG_CATEGORY.findOneAndUpdate(
      { _id: id },
      req.body,
      { new: true }
    );

    if (updateBlogCategory) {
      const updatedBlogCategory = await BLOG_CATEGORY.find()
      res.json({
        status: "success",
        message: "blog category updated Successfully",
        response: updatedBlogCategory,
      });
    } else {
      res.json({ status: "error", message: "blog category update failed" });
    }
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });

  }
};

const handleDeleteBlogCategory = async (req, res) => {
  const { id } = req.params;
  try {
    const deleteResponse = await BLOG_CATEGORY.deleteOne({ _id: id });
    if (deleteResponse) {
      const updatedBlogCategory = await BLOG_CATEGORY.find()
      res.json({
        status: "success",
        message: "Products deleted Successfully",
        response: updatedBlogCategory,
      });
    } else {
      res.json({ status: "error", message: "Product deletion failed" });
    }
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });

  }
};

const handleGetBlogCategory = async (req, res) => {
  const { id } = req.params;
  try {
    const response = await BLOG_CATEGORY.find({ _id: id });
    if (response) {
      res.json({
        status: "success",
        response: response,
        message : "blog category fetched successfully"
      });
    } else {
      res.json({ status: "error", message: "Category not exists" });
    }
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });

  }
};

const handleGetAllBlogCategory = async (req, res) => {
  try {
    const response = await BLOG_CATEGORY.find();
    res.json({
      status: "success",
      response: response,
      message : "blogs categories fetched successfully"

    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });

  }
};

module.exports = {
  handleCreateBlogCategory,
  handleUpdateBlogCategory,
  handleDeleteBlogCategory,
  handleGetBlogCategory,
  handleGetAllBlogCategory,
};
