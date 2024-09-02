const ADDRESS = require("../models/address");

const handleCreateAddress = async (req, res) => {
  try {
    const user = req.user; // user id = user._id
    const { firstname, lastname, email, phone, address } = req.body;

    // valida tion
    if (!phone) {
      return res.status(400).json({ message: "Phone field is required" });
    }

    if (!address) {
      return res.status(400).json({ message: "Address field is required" });
    }

    // creating object - which is required in both case
    let information = {
      firstname: firstname || user?.name?.split(" ")[0] || "",
      lastname: lastname || user?.name?.split(" ")[1] || "",
      email: email || user?.email || "",
      phone: phone,
      address: address,
    };

    // Check if the user already has an address
    const alreadyPresent = await ADDRESS.findOne({ user: user._id });

    let response;
    if (alreadyPresent) {
      // If the address already exists, push new details into the details array
      response = await ADDRESS.updateOne(
        { user: user._id },
        { $push: { details: information } }
      );
    } else {
      // If the address does not exist, create a new address document
      const newAddress = new ADDRESS({
        user: user._id,
        details: [information],
      });
      response = await newAddress.save();
    }

    // Return the appropriate response
    if (response) {
      const updatedAddresses = await ADDRESS.findOne({ user: user._id }).populate('user');
      return res
        .status(201)
        .json({
          message: "Address created successfully",
          response: updatedAddresses,
        });
    } else {
      return res.status(404).json({ message: "Address creation failed" });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const handleGetUserAddress = async (req, res) => {
  const { _id } = req.user;
  console.log(_id)
  try {
    const response = await ADDRESS.findOne({ user: _id }).populate('user');

    if (response) {
      return res
        .status(201)
        .json({ message: "Address fetched successfully", response: response });
    } else {
      return res.status(404).json({ message: "Address fetched failed" });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
}
};

const handleDeleteAddress = async(req,res)=>{
    const {_id} = req.user
    const {addressId} = req.params
    
    try {
        if(!addressId) return res.status(400).json({message:"address id not specified"})

        const response = await ADDRESS.updateOne({user:_id} , {$pull:{details:{_id:addressId}}})

        if (response.modifiedCount > 0) {
            const updatedAddress  = await ADDRESS.findOne({user: _id})
            return res.status(200).json({ message: "Address deleted successfully" , response:updatedAddress});
          } else {
            return res.status(404).json({ message: "Address not found or not deleted" });
          }
        
    } catch (error) {
        
        return res.status(500).json({ error: error.message });
    }
}

module.exports = { handleCreateAddress, handleGetUserAddress ,handleDeleteAddress};
