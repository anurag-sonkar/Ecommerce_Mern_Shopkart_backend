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
    res.status(201).json(newCoupon);
  } catch (error) {
    throw new Error(error);
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

    res.json(formattedCoupon);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const handleUpdateCoupon = async (req, res) => {
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
    res.json(updatecoupon);
  } catch (error) {
    throw new Error(error);
  }
};

const handleGetAllCoupons = async (req, res) => {
  try {
    const coupons = await COUPON.find();
    res.json(coupons);
  } catch (error) {
    throw new Error(error);
  }
};

const handleDeleteCoupon = async (req, res) => {
  const { id } = req.params;
  try {
    const deletecoupon = await COUPON.findByIdAndDelete({_id:id});
    res.json(deletecoupon);
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = {
  handleCouponGenerate,
  handleGetAllCoupons,
  handleUpdateCoupon,
  handleDeleteCoupon,
  handleGetCoupon,
};
