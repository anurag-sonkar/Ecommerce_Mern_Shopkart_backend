const BRAND = require("../models/brand");

const handleCreateBrand = async (req, res) => {
  try {
    const brand = await BRAND.create(req.body);
    res.status(201).json({ status: "success", brand });
  } catch (error) {
    throw new Error(error);
  }
};

const handleUpdateBrand = async (req, res) => {
  
  console.log("Start")
  const { id } = req.params;
  console.log(id)
  try {
    const updateBrand = await BRAND.findOneAndUpdate(
      { _id: id },
      req.body,
      { new: true }
    );

    if (updateBrand) {
      res.json({
        status: "success",
        message: "Brand updated Successfully",
        response: updateBrand,
      });
    } else {
      res.json({ status: "error", message: "Brand update failed" });
    }
  } catch (error) {
    throw new Error(error);
  }
};


const handleDeleteBrand = async(req,res)=>{
  const { id } = req.params;
  try {
    const deleteResponse = await BRAND.deleteOne({ _id: id });
    if (deleteResponse) {
      res.json({
        status: "success",
        message: "Brand deleted Successfully",
        response: deleteResponse,
      });
    } else {
      res.json({ status: "error", message: "Brand deletion failed" });
    }
  } catch (error) {
    throw new Error(error);
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
  throw new Error(error);
  
}
  
}



const handleGetAllBrand = async(req,res)=>{
  try {
    const response = await BRAND.find()
    res.json({
      status: "success",
      response: response,
    });
  } catch (error) {
  throw new Error(error);
    
  }

}


module.exports = { handleCreateBrand,
    handleUpdateBrand,
    handleDeleteBrand,
    handleGetBrand,
    handleGetAllBrand,};
