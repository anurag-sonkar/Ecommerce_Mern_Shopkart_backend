const PRODUCT_CATEGORY = require("../models/productCategory");

const handleCreateProductCategory = async (req, res) => {
  try {
    const category = await PRODUCT_CATEGORY.create(req.body);
    res.status(201).json({ status: "success", category });
  } catch (error) {
    throw new Error(error);
  }
};

const handleUpdateProductCategory = async (req, res) => {
  
  console.log("Start")
  const { id } = req.params;
  console.log(id)
  try {
    const updateProductCategory = await PRODUCT_CATEGORY.findOneAndUpdate(
      { _id: id },
      req.body,
      { new: true }
    );
  console.log(updateProductCategory)

    if (updateProductCategory) {
      res.json({
        status: "success",
        message: "PRODUCT_CATEGORY updated Successfully",
        response: updateProductCategory,
      });
    } else {
      res.json({ status: "error", message: "PRODUCT_CATEGORY update failed" });
    }
  } catch (error) {
    throw new Error(error);
  }
};


const handleDeleteProductCategory = async(req,res)=>{
  const { id } = req.params;
  try {
    const deleteResponse = await PRODUCT_CATEGORY.deleteOne({ _id: id });
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
}

const handleGetProductCategory = async(req,res)=>{
  const { id } = req.params;
try {
  const response = await PRODUCT_CATEGORY.find({_id:id})
  if(response){
    res.json({
      status: "success",
      response: response,
    });
  }else{
    res.json({ status: "error", message: "Category not exists" });

  }
  
} catch (error) {
  throw new Error(error);
  
}
  
}



const handleGetAllProductCategory = async(req,res)=>{
  try {
    const response = await PRODUCT_CATEGORY.find()
    res.json({
      status: "success",
      response: response,
    });
  } catch (error) {
  throw new Error(error);
    
  }

}


module.exports = { handleCreateProductCategory, handleUpdateProductCategory ,handleDeleteProductCategory , handleGetProductCategory
  , handleGetAllProductCategory};
