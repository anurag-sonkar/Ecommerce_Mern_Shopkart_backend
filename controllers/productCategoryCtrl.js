const PRODUCT_CATEGORY = require("../models/productCategory");

const handleCreateProductCategory = async (req, res) => {
  try {
    const category = await PRODUCT_CATEGORY.create(req.body);
    res.status(201).json({ status: "success", response : category , message:"product category created successfully"});
  } catch (error) {
    if (error.code === 11000) { // MongoDB duplicate key error code
      res.status(400).json({ status: "error", message: "Category already exists" });
    } else {
      res.status(500).json({ status: "error", message: error.message });
    }
  }
};

const handleUpdateProductCategory = async (req, res) => {
  
  const { id } = req.params;
  try {
    const updateProductCategory = await PRODUCT_CATEGORY.findOneAndUpdate(
      { _id: id },
      req.body,
      { new: true }
    );

    if (updateProductCategory) {
      const updatedProductCategory = await PRODUCT_CATEGORY.find()
      res.json({
        status: "success",
        message: "PRODUCT_CATEGORY updated Successfully",
        response: updatedProductCategory,
      });
    } else {
      res.json({ status: "error", message: "PRODUCT_CATEGORY update failed" });
    }
  } catch (error) {
    if (error.code === 11000) { // MongoDB duplicate key error code
      return res.status(400).json({ status: "error", message: "Category already exists" });
    } else {
      res.status(500).json({ status: "error", message: error.message });
    }
  }
};


const handleDeleteProductCategory = async(req,res)=>{
  const { id } = req.params;
  try {
    const deleteResponse = await PRODUCT_CATEGORY.deleteOne({ _id: id });
    if (deleteResponse) {
      const updatedResult = await PRODUCT_CATEGORY.find()
      res.json({
        status: "success",
        message: "Products category deleted Successfully",
        response: updatedResult,
      });
    } else {
      res.status(400).json({ status: "error", message: "Product category deletion failed" });
    }
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
    
    
  }
}

const handleGetProductCategory = async(req,res)=>{
  const { id } = req.params;
try {
  const response = await PRODUCT_CATEGORY.find({_id:id})
  if(response){
    res.json({
      status: "success",
      response: response,
      message:"product fetched successfully"
    });
  }else{
    res.json({ status: "error", message: "Product Category not exists" });

  }
  
} catch (error) {
  res.status(500).json({ status: "error", message: error.message });

  
}
  
}



const handleGetAllProductCategory = async(req,res)=>{
  try {
    const response = await PRODUCT_CATEGORY.find()
    res.json({
      status: "success",
      response: response,
      message:"products category fetched successfully"
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });

    
  }

}


module.exports = { handleCreateProductCategory, handleUpdateProductCategory ,handleDeleteProductCategory , handleGetProductCategory
  , handleGetAllProductCategory};
