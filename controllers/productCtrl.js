const PRODUCT = require("../models/product");
const slugify = require("slugify");

const createProduct = async (req, res) => {
  // console.log(req.body)
  try {
    if (req.body.title) req.body.slug = slugify(req.body.title);

    const newProduct = await PRODUCT.create(req.body);
    res.json(newProduct);
  } catch (error) {
    throw new Error(error);
  }
};

const getProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await PRODUCT.findOne({ _id: id });
    if (product) {
      res.json({ status: "success", product: product });
    } else {
      res.json({ status: "error", message: "product not found" });
    }
  } catch (error) {
    throw new Error(error);
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
    throw new Error(error);
  }
};
const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const deleteResponse = await PRODUCT.deleteOne({ _id: id });
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

const getAllProducts = async(req,res)=>{
    /* filtering*/
    const {title,category,brand,minPrice, maxPrice, color , sortBy, sortOrder , limit ,page } = req.query

    // create a filter object
    let filter = {}

    if(title){
        // regex for partial matching , i for avoiding-case conflict
        filter.title = {$regex: new RegExp(title,"i")}
    }
    
    if(category){
        filter.category = {$regex: new RegExp(category,"i")}
    }
    
    if(brand){
        filter.brand = {$regex: new RegExp(brand,"i")}
    }

    if(minPrice || maxPrice){
        filter.price = {}
        if(minPrice){
            filter.price.$gte = minPrice
        }
        if(maxPrice){
            filter.price.$lte = maxPrice
        }
    }

    if(color){
        filter.color = {$regex: new RegExp(color , "i")}
    }

    /* Sorting of Products */
    // create a sort object
    let sort = {}

    if(sortBy){
        sort[sortBy] = sortOrder === 'desc' ? -1 : 1
    }


    /* limiting products and Pagination*/
    const MAX_LIMIT = 5 
    let limitValue = limit ? parseInt(limit) : MAX_LIMIT
    let pageValue = page ? parseInt(page) : 1
    // set maxlimit
    if(limitValue > MAX_LIMIT){
        limitValue = MAX_LIMIT
    }

    const skipValue = (pageValue - 1) * limitValue

    
    // console.log(filter , sort , limit)


    try {
        const products = await PRODUCT.find(filter).skip(skipValue).sort(sort).limit(limitValue)
        if(products){
            res.json({status:"success" , products : products})
        }else{
            res.json({status:"error" , message: "products not found"})
        }

    } catch (error) {
        throw new Error(error);
    }
}



module.exports = {
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct,
  getAllProducts,
};
