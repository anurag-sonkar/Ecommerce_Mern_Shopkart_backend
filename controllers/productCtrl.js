const PRODUCT = require("../models/product");
const slugify = require("slugify");
const USER = require("../models/user");
const { cloudinaryUploadImg , cloudinaryDeleteImg } = require("../utils/cloudinary");
const fs = require('fs');
const { productImgResize } = require("../middleware/uploadImages");
const mongoose = require('mongoose')

const createProduct = async (req, res) => {
  try {
    if (req.body.title) req.body.slug = slugify(req.body.title);

    const newProduct = await PRODUCT.create(req.body);
    res.status(201).json({message:"product created successfully" , response : newProduct});
  } catch (error) {
    return res.status(500).json({message:error.message})
  }
};

const getProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await PRODUCT.findOne({ _id: id }).populate(['color','ratings.date']).populate({
      path: 'ratings.postedby',
      select: 'name imgpath', // Specify the fields to select
    });
    if (product) {
      return res.status(200).json({ status: "success", response: product , message:"product fetched successfully"});
    } else {
      return res.status(400).json({ status: "error", message: "product not found" });
    }
  } catch (error) {
    return res.status(500).json({message:error.message})
    
  }
};

const updateProduct = async (req, res) => {
  const { id } = req.params;
  try {
    if (req.body.title) req.body.slug = slugify(req.body.title);

    const updateProduct = await PRODUCT.findOneAndUpdate(
      { _id: id },
      req.body,
      { new: true }
    );
    if (updateProduct) {
      res.json({
        status: "success",
        message: "Products updated Successfully",
        response: updateProduct,
      });
    } else {
      res.json({ status: "error", message: "Product update failed" });
    }
  } catch (error) {
    return res.status(500).json({message:error.message})
    
  }
};
const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const deleteResponse = await PRODUCT.deleteOne({ _id: id });
    if (deleteResponse) {
      const updatedResult = await PRODUCT.find()
      res.json({
        status: "success",
        message: "Products deleted Successfully",
        response: updatedResult,
      });
    } else {
      res.json({ status: "error", message: "Product deletion failed" });
    }
  } catch (error) {
    return res.status(500).json({message:error.message})
    
  }
};

const getAllProducts = async (req, res) => {
  /* filtering*/
  const {
    totalrating,
    tag,
    title,
    category,
    brand,
    minPrice,
    maxPrice,
    color,
    sortBy,
    sortOrder,
    limit,
    page,
  } = req.query;

  // create a filter object
  let filter = {};

  if (title) {
    // regex for partial matching , i for avoiding-case conflict
    filter.title = { $regex: new RegExp(title, "i") };
  }

  if (category) {
    filter.category = { $regex: new RegExp(category, "i") };
  }

  if (brand) {
    filter.brand = { $regex: new RegExp(brand, "i") };
  }

  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) {
      filter.price.$gte = minPrice;
    }
    if (maxPrice) {
      filter.price.$lte = maxPrice;
    }
  }

  if (color) {
    // filter.color = { $regex: new RegExp(color, "i") };
    filter.color = new mongoose.Types.ObjectId(color);
  }

  if(tag){
    // filter.tags = {$regex: new RegExp(tag, "i")}
    filter.tags = { $in: [new RegExp(tag, "i")] };
  }

    if (totalrating) {
      // filter.totalrating = { $regex: "^" + totalrating + "$", $options: "i" };
      filter.totalrating = { $regex: new RegExp(totalrating, "i") }
    }
    

  /* Sorting of Products */
  // create a sort object
  let sort = {};

  if (sortBy) {
    sort[sortBy] = sortOrder === "desc" ? -1 : 1;
  }

  /* limiting products and Pagination*/
  // const MAX_LIMIT = 9;
  // let limitValue = limit ? parseInt(limit) : MAX_LIMIT;
  // let pageValue = page ? parseInt(page) : 1;
  // // set maxlimit
  // if (limitValue > MAX_LIMIT) {
  //   limitValue = MAX_LIMIT;
  // }

  let limitValue = limit ? parseInt(limit) : 0
  let pageValue = page ? parseInt(page) : 1

  const skipValue = (pageValue - 1) * limitValue;

  // console.log(filter , sort , limit)
  // console.log(filter)

  try {
    const products = await PRODUCT.find(filter)
      .skip(skipValue)
      .sort(sort)
      .limit(limitValue)
      .populate('color')

    if (products) {
      res.json({ status: "success", response: products , message : "all products fetched successfully"});
    } else {
      res.json({ status: "error", message: "products not found" });
    }
  } catch (error) {
    return res.status(500).json({message:error.message})
    
  }
};

const addToWishlist = async (req, res) => {
  const { productId } = req.body; // product id which needs to be added/removed from user wishlist
  // console.log(req.body)
  // Validate productId
  // if (!mongoose.Types.ObjectId.isValid(productId)) {
  //   return res.status(400).json({ message: "Invalid product ID" });
  // }

  try {
    // Find the product you want to add to your wishlist
    const product = await PRODUCT.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // User which is logged in
    const user = req.user;
    const id = req.userid;

    // Find if the user has liked the product
    const isAdded = user.wishlist.includes(productId);

    if (isAdded) {
      // If user already added the product in its wishlist, then remove it
      const response = await USER.findByIdAndUpdate(
        {_id:id},
        {
          $pull: { wishlist: productId },
        },
        {
          new: true,
        }
      ).populate("wishlist");
      res.json({response :response , message:"removed from wishlist"});
    } else {
      const response = await USER.findByIdAndUpdate(
        {_id:id},
        {
          $push: { wishlist: productId },
        },
        {
          new: true,
        }
      ).populate("wishlist");
      res.json({response :response , message:"added to wishlist"});
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const handleCreateProductRating = async(req,res)=>{
  // Extract user ID and rating details from request
  const { _id } = req.user; // User ID from authentication middleware
  const { star, prodId, comment } = req.body; // Star rating, product ID, and comment from request body

  try {
    // Find the product by its ID
    const product = await PRODUCT.findById(prodId);

    // Check if the user has already rated the product
    let alreadyRated = product.ratings.find(
      (rating) => rating.postedby.toString() === _id.toString()
    );

    if (alreadyRated) {
      // If the user has already rated, update the existing rating
      await PRODUCT.updateOne(
        {
          ratings: { $elemMatch: alreadyRated },
        },
        {
          $set: { "ratings.$.star": star, "ratings.$.comment": comment },
        },
        {
          new: true,
        }
      )
    } else {
      // If the user has not rated, add a new rating
      await PRODUCT.findByIdAndUpdate(
        {_id:prodId},
        {
          $push: {
            ratings: {
              star,
              comment,
              postedby: _id,
            },
          },
        },
        {
          new: true,
        }
      )
    }

    // Recalculate the total rating
    const updatedProduct = await PRODUCT.findById(prodId);
    let totalRatings = updatedProduct.ratings.length;
    let ratingSum = updatedProduct.ratings.reduce((acc, rating) => acc + rating.star, 0);
    let averageRating = Math.round(ratingSum / totalRatings);

    // Update the product with the new average rating
    let finalProduct = await PRODUCT.findByIdAndUpdate(
      {_id:prodId},
      {
        totalrating: averageRating,
      },
      { new: true }
    ).populate('ratings.postedby', ['name','date'])

    // Send the updated product as response
    res.json({response :finalProduct , message : "review posted successfully"});
  } catch (error) {
    return res.status(500).json({message:error.message})
    
  }
}


const handleGetProductRatings = async(req,res)=>{
  const {id} = req.params
  try {
    const response = await PRODUCT.findById(id).populate('ratings.postedby', ['email','name','date'])

    
  } catch (error) {
    
    return res.status(500).json({message:error.message})
  }
}

const uploadImages = async (req, res) => {
  try {
    const uploader = (path) => cloudinaryUploadImg(path, "images");
    const urls = [];
    const files = req.files;
    for (const file of files) {
      const { path } = file;
      const newpath = await uploader(path);
      urls.push(newpath);
      // fs.unlinkSync(path);
    }
    const images = urls.map((file) => file);
    res.json(images);
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

const deleteImages = async (req, res) => {
  const { id } = req.params;
  try {
    await cloudinaryDeleteImg(id);
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

module.exports = {
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct,
  getAllProducts,
  addToWishlist,
  handleCreateProductRating,
  handleGetProductRatings,
  uploadImages,
  deleteImages
};
