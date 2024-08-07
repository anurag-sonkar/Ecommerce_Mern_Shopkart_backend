const { parseISO, parse, format } = require("date-fns");
const COUPON = require("../models/coupon");

const handleCouponGenerate = async (req, res) => {
  const { name, expiry, discount } = req.body;
  try {
    let expiryDate = parseISO(expiry);
    if (isNaN(expiryDate)) {
      expiryDate = parse(expiry, "MM/dd/yyyy", new Date());
    }
    if (isNaN(expiryDate)) {
      expiryDate = parse(expiry, "dd-MM-yyyy", new Date());
    }

    if (isNaN(expiryDate)) {
      return res.status(400).json({ message: "Invalid date format" });
    }

    const newCoupon = new COUPON({ name, expiry: expiryDate, discount });
    await newCoupon.save();
    res.status(201).json({resposne : newCoupon , "message" : "coupon generated successfully"});
  } catch (error) {
    return res.status(500).json({message:error.message})
  }
};

const handleGetCoupon = async (req, res) => {
  const { id } = req.params;
  try {
    const getAcoupon = await COUPON.findById(id);
    if (!getAcoupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }

    // Format the expiry date
    const formattedCoupon = {
      ...getAcoupon._doc,
      expiry: format(new Date(getAcoupon.expiry), "dd-MM-yyyy"),
    };

    res.json({response : formattedCoupon , message : "fetch coupon successfully"});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const handleUpdateCoupon = async (req, res) => {
  console.log("body",req.body)
    const {id} = req.params
  const { name, expiry, discount } = req.body;

  try {
    let expiryDate = parseISO(expiry);
    if (isNaN(expiryDate)) {
      expiryDate = parse(expiry, "MM/dd/yyyy", new Date());
    }
    if (isNaN(expiryDate)) {
      expiryDate = parse(expiry, "dd-MM-yyyy", new Date());
    }

    if (isNaN(expiryDate)) {
      return res.status(400).json({ message: "Invalid date format" });
    }

    const updatecoupon = await COUPON.findByIdAndUpdate(
      { _id: id },
      { name, expiry:expiryDate, discount },
      {
        new: true,
      }
    );
    if(updatecoupon){
      const updatedCoupon = await COUPON.find()
      res.status(200).json({response : updatedCoupon , message : "coupon updated successfully"});
    }else{

    }
  } catch (error) {
    return res.status(500).json({message:error.message})
  }
};

const handleGetAllCoupons = async (req, res) => {
  try {
    const coupons = await COUPON.find();
    res.json({response : coupons , message : "coupons fetched successfully"});
  } catch (error) {
    return res.status(500).json({message:error.message})
  }
};

const handleDeleteCoupon = async (req, res) => {
  const { id } = req.params;
  try {
    const deletecoupon = await COUPON.findByIdAndDelete({_id:id});
    if(deletecoupon){
      const updatedCoupons = await COUPON.find()
      return res.status(200).json({response : updatedCoupons , message : "coupon deleted successfully"});
      
    }
    else{
      
      return res.status(400).json({ message : "delete coupon failed"});
    }
  } catch (error) {
    return res.status(500).json({message:error.message})
  }
};

module.exports = {
  handleCouponGenerate,
  handleGetAllCoupons,
  handleUpdateCoupon,
  handleDeleteCoupon,
  handleGetCoupon,
};
