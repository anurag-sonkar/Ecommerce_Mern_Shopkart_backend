const BRAND = require("../models/brand");

const handleCreateBrand = async (req, res) => {
  try {
    const brand = await BRAND.create(req.body);
    return res.status(201).json({ status: "success", brand , message : "brand created successfully" });
  } catch (error) {
    return res.status(400).json({status:"error" , message:error.message})
  }
};

const handleUpdateBrand = async (req, res) => {
  
  const { id } = req.params;

  try {
    const updateBrand = await BRAND.findOneAndUpdate(
      { _id: id },
      req.body,
      { new: true }
    );

    if (updateBrand) {
      const updatedBrands = await BRAND.find()
      return res.json({
        status: "success",
        message: "Brand updated Successfully",
        response: updatedBrands,
      });
    } else {
      return res.json({ status: "error", message: "Brand update failed" });
    }
  } catch (error) {
    return res.json({ status: "error", message: error.message });
  }
};


const handleDeleteBrand = async(req,res)=>{
  const { id } = req.params;
  try {
    const deleteResponse = await BRAND.deleteOne({ _id: id });
    if (deleteResponse) {
      const updatedBrands = await BRAND.find()
      res.json({
        status: "success",
        message: "Brand deleted Successfully",
        response: updatedBrands,
      });
    } else {
      res.json({ status: "error", message: "Brand deletion failed" });
    }
  } catch (error) {
    res.json({ status: "error", message: error.message });
  }
}

const handleGetBrand = async(req,res)=>{
  const { id } = req.params;
try {
  const response = await BRAND.find({_id:id})
  if(response){
    res.json({
      status: "success",
      response: response,
    });
  }else{
    res.json({ status: "error", message: "Brand not exists" });

  }
  
} catch (error) {
  return res.status(400).json({status:"error" , message:error.message})
  
}
  
}



const handleGetAllBrand = async(req,res)=>{
  try {
    const response = await BRAND.find()
    return res.status(200).json({
      status: "success",
      response: response,
      message:"brands fetched successfully",
    });
  } catch (error) {
  return res.status(400).json({status:"error" , message:error.message})
    
  }

}


module.exports = { handleCreateBrand,
    handleUpdateBrand,
    handleDeleteBrand,
    handleGetBrand,
    handleGetAllBrand,};
