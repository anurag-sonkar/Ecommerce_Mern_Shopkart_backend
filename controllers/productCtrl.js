const PRODUCT = require("../models/product");
const slugify = require('slugify')
const createProduct = async (req, res) => {
  try {
    if(req.body.title) req.body.slug = slugify(req.body.title)

    const newProduct = await PRODUCT.create(req.body);
    res.json(newProduct);
  } catch (error) {
    throw new Error(error);
}
};

const getProduct = async(req,res)=>{
    const {id} = req.params
    try {
        const product = await PRODUCT.findOne({_id : id})
        if(product){
            res.json({status:"success" , product : product})
        }else{
            res.json({status:"error" , message: "product not found"})
        }

        
    } catch (error) {
        throw new Error(error);
        
    }
}



const updateProduct = async(req,res)=>{
    const {id} = req.params
    try {
    if(req.body.title) req.body.slug = slugify(req.body.title)

        const updateProduct = await PRODUCT.findOneAndUpdate({_id:id}, req.body , {new:true})
        if(updateProduct){
            res.json({status:"success" ,message:"Products updated Successfully" ,response : updateProduct})
        }else{
            res.json({status:"error" , message: "Product update failed"})
        }

    } catch (error) {
        throw new Error(error);

        
    }
}
const deleteProduct = async(req,res)=>{
    const {id} = req.params
    try {
        const deleteResponse = await PRODUCT.deleteOne({_id:id})
        if(deleteResponse){
            res.json({status:"success" ,message:"Products deleted Successfully" ,response : deleteResponse})
        }else{
            res.json({status:"error" , message: "Product deletion failed"})
        }

    } catch (error) {
        throw new Error(error);
    }
}

const getAllProducts = async(req,res)=>{
    try {
        const products = await PRODUCT.find()
        if(products){
            res.json({status:"success" , products : products})
        }else{
            res.json({status:"error" , message: "products not found"})
        }

    } catch (error) {
        throw new Error(error);
    }
}

module.exports = { createProduct ,getProduct,updateProduct,deleteProduct,getAllProducts};
