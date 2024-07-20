const BLOG = require("../models/blog");
const USER = require("../models/user");
const { cloudinaryUploadImg } = require("../utils/cloudinary");
const fs = require('fs')

const handleCreateNewBlog = async (req, res) => {
  try {
    const newBlog = await BLOG.create(req.body);
    res.status(201).json({ status: "success", newBlog });
  } catch (error) {
    throw new Error(error);
  }
};

const handleUpdateBlog = async (req, res) => {
  const { id } = req.params;

  try {
    const updateBlog = await BLOG.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res
      .status(201)
      .json({ status: "201", message: "success", response: updateBlog });
  } catch (error) {
    res
      .status(400)
      .json({ status: "400", message: "failed", response: error.message });
  }
};

const handleGetBlog = async (req, res) => {
  const { id } = req.params;

  try {
    const getBlog = await BLOG.findById(id)

    const updateViews = await BLOG.findByIdAndUpdate(
      { _id: id },
      {
        $inc: { numViews: 1 },
      },
      { new: true }
    ).populate("likes" ,["name","email"]).populate("dislikes",["name","email"]);
    
    res
      .status(200)
      .json({ status: "200", message: "success", response: updateViews });
  } catch (error) {
    res
      .status(400)
      .json({ status: "400", message: "failed", response: error.message });
  }
};

const handleGetAllBlog = async (req, res) => {
  try {
    const getBlogs = await BLOG.find();
    res
      .status(200)
      .json({ status: "200", message: "success", response: getBlogs });
  } catch (error) {
    res
      .status(400)
      .json({ status: "400", message: "failed", response: error.message });
  }
};

const handleDeleteBlog = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedBlog = await BLOG.findByIdAndDelete(id);
    res
      .status(200)
      .json({ status: "200", message: "success", response: deletedBlog });
  } catch (error) {
    res
      .status(400)
      .json({ status: "400", message: "failed", response: error.message });
  }
};

// like the blog
const handleLikeBlog = async (req, res) => {
  const {blogId} = req.body;
  try {
    // Find the blog which you want to be liked
    const blog = await BLOG.findById({ _id: blogId });
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // Find the login user
    const loginUserId = req.user._id;

    // Find if the user has liked the blog
    const isLiked = blog.likes.includes(loginUserId);

    // Find if the user has disliked the blog
    const alreadyDisliked = blog.dislikes.includes(loginUserId);

    let updatedBlog;

    if (alreadyDisliked) {
      // If the user already disliked the blog, remove the dislike
      updatedBlog = await BLOG.findByIdAndUpdate(
        { _id: blogId },
        {
          $pull: { dislikes: loginUserId },
          isDisliked: false,
        },
        { new: true }
      );
    }

    if (isLiked) {
      // If the user already liked the blog, remove the like
      updatedBlog = await BLOG.findByIdAndUpdate(
        { _id: blogId },
        {
          $pull: { likes: loginUserId },
          isLiked: false,
        },
        { new: true }
      );
    } else {
      // If the user has not liked the blog, add the like
      updatedBlog = await BLOG.findByIdAndUpdate(
        { _id: blogId },
        {
          $push: { likes: loginUserId },
          isLiked: true,
        },
        { new: true }
      );
    }

    res.json(updatedBlog);
  } catch (error) {
    res.status(500).json({ message: error.message });
}
};

const handleDislikeBlog = async(req,res)=>{
    const {blogId} = req.body;
    
    try {
        // Find the blog which you want to be liked
    const blog = await BLOG.findById({ _id: blogId });
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // Find the login user
    const loginUserId = req.user._id;

    // Find if the user has disliked the blog
    const alreadyDisliked = blog.dislikes.includes(loginUserId);

    // Find if the user has liked the blog
    const isLiked = blog.likes.includes(loginUserId);

    let updatedBlog;

    if (isLiked) {
      // If the user already disliked the blog, remove the dislike
      updatedBlog = await BLOG.findByIdAndUpdate(
        { _id: blogId },
        {
          $pull: { likes: loginUserId },
          isliked: false,
        },
        { new: true }
      );
    }
        

    if (alreadyDisliked) {
        // If the user already liked the blog, remove the like
        updatedBlog = await BLOG.findByIdAndUpdate(
          { _id: blogId },
          {
            $pull: { dislikes: loginUserId },
            isDisliked: false,
          },
          { new: true }
        );
      } else {
        // If the user has not liked the blog, add the like
        updatedBlog = await BLOG.findByIdAndUpdate(
          { _id: blogId },
          {
            $push: { dislikes: loginUserId },
            isDisliked: true,
          },
          { new: true }
        );
      }
  
      res.json(updatedBlog);
    } catch (error) {
        
        res.status(500).json({ message: error.message });
  }
}

const uploadImages = async (req, res) => {
  const {id} = req.params
  try {
    const uploader = (path) => cloudinaryUploadImg(path, "images");
    const urls = [];
    const files = req.files;
    for (const file of files) {
      const { path } = file;
      const newpath = await uploader(path);
      urls.push(newpath);
      fs.unlinkSync(path);
    }
    const findBlog = await BLOG.findByIdAndUpdate(id ,{
      images : urls.map(file=>file)
    },{new:true})

    res.json(findBlog);
  } catch (error) {
    throw new Error(error);
  }
}


module.exports = {
  handleCreateNewBlog,
  handleUpdateBlog,
  handleGetBlog,
  handleGetAllBlog,
  handleDeleteBlog,
  handleLikeBlog,
  handleDislikeBlog,
  uploadImages
};
