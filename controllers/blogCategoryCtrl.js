const BLOG_CATEGORY = require("../models/blogCategory");

const handleCreateBlogCategory = async (req, res) => {
  try {
    const category = await BLOG_CATEGORY.create(req.body);
    res.status(201).json({ status: "success", category });
  } catch (error) {
    throw new Error(error);
  }
};

const handleUpdateBlogCategory = async (req, res) => {
  console.log("Start");
  const { id } = req.params;
  console.log(id);
  try {
    const updateBlogCategory = await BLOG_CATEGORY.findOneAndUpdate(
      { _id: id },
      req.body,
      { new: true }
    );
    console.log(updateBlogCategory);

    if (updateBlogCategory) {
      res.json({
        status: "success",
        message: "BLOG_CATEGORY updated Successfully",
        response: updateBlogCategory,
      });
    } else {
      res.json({ status: "error", message: "BLOG_CATEGORY update failed" });
    }
  } catch (error) {
    throw new Error(error);
  }
};

const handleDeleteBlogCategory = async (req, res) => {
  const { id } = req.params;
  try {
    const deleteResponse = await BLOG_CATEGORY.deleteOne({ _id: id });
    if (deleteResponse) {
      res.json({
        status: "success",
        message: "Products deleted Successfully",
        response: deleteResponse,
      });
    } else {
      res.json({ status: "error", message: "Product deletion failed" });
    }
  } catch (error) {
    throw new Error(error);
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
      });
    } else {
      res.json({ status: "error", message: "Category not exists" });
    }
  } catch (error) {
    throw new Error(error);
  }
};

const handleGetAllBlogCategory = async (req, res) => {
  try {
    const response = await BLOG_CATEGORY.find();
    res.json({
      status: "success",
      response: response,
    });
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = {
  handleCreateBlogCategory,
  handleUpdateBlogCategory,
  handleDeleteBlogCategory,
  handleGetBlogCategory,
  handleGetAllBlogCategory,
};
