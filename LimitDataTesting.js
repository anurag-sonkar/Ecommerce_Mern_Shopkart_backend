/*  filtering products */
// const getAllProducts = async (req, res) => {
//   const { title, category, brand, minPrice, maxPrice, color } = req.query;

//   // Create a filter object
//   let filter = {};

//   if (title) {
//     // Use regex for partial matching , i for avoiding upercase-lowercasse conflicts
//     filter.title = { $regex: title, $options: "i" };
//   }

//   if (category) {
//     filter.category = { $regex: new RegExp(category, "i") };
//   }

//   if (brand) {
//     // filter.brand = brand;

//     // Case-insensitive matching for brand
//     filter.brand = { $regex: new RegExp(brand, "i") };
    
//   }

//   if (minPrice || maxPrice) {
//     filter.price = {};
//     if (minPrice) {
//       filter.price.$gte = minPrice;
//     }
//     if (maxPrice) {
//       filter.price.$lte = maxPrice;
//     }
//   }

//   if (color) {
//     filter.color = { $regex: new RegExp(color, "i") };
//   }

//   console.log(filter)

//   try {
//     const products = await PRODUCT.find(filter);
//     if (products.length > 0) {
//       res.json({ status: "success", products: products });
//     } else {
//       res.json({ status: "error", message: "products not found" });
//     }
//   } catch (error) {
//     res.status(500).json({ status: "error", message: error.message });
//   }
// };


/* sorting products */
// const getAllProducts = async (req, res) => {
//     const { sortBy, sortOrder } = req.query;

//     // Create a sort object
//     let sort = {};

//     if (sortBy) {
//         sort[sortBy] = sortOrder === 'desc' ? -1 : 1; // Default to ascending order if sortOrder is not specified
//     }
// console.log(sort)
//     try {
//         const products = await PRODUCT.find().sort(sort);
//         if (products.length > 0) {
//             res.json({ status: "success", products: products });
//         } else {
//             res.json({ status: "error", message: "products not found" });
//         }
//     } catch (error) {
//         res.status(500).json({ status: "error", message: error.message });
//     }
// };


/* limiting products */
// const getAllProducts = async (req, res) => {
//     const { limit } = req.query;

//     // Convert limit to an integer if provided, otherwise default to no limit
//     const limitValue = limit ? parseInt(limit) : 0;
//     // console.log(typeof(limit)  , typeof(limitValue))
//     // console.log(limit  , limitValue)

//     try {
//         const products = await PRODUCT.find().limit(limitValue);
//         if (products.length > 0) {
//             res.json({ status: "success", products: products });
//         } else {
//             res.json({ status: "error", message: "products not found" });
//         }
//     } catch (error) {
//         res.status(500).json({ status: "error", message: error.message });
//     }
// };

/* pagination of products */
// const getAllProducts = async (req, res) => {
//     const { page, limit } = req.query;

//     // Define the maximum limit
//     const MAX_LIMIT = 5;

//     // Convert page and limit to integers if provided, otherwise default to page 1 and no limit
//     const pageValue = page ? parseInt(page) : 1;
//     let limitValue = limit ? parseInt(limit) : MAX_LIMIT;

//     // Enforce the maximum limit
//     if (limitValue > MAX_LIMIT) {
//         limitValue = MAX_LIMIT;
//     }

//     const skipValue = (pageValue - 1) * limitValue;

//     console.log(skipValue , limitValue)
//     try {
//         const products = await PRODUCT.find().skip(skipValue).limit(limitValue);
//         if (products.length > 0) {
//             res.json({ status: "success", products: products });
//         } else {
//             res.json({ status: "error", message: "products not found" });
//         }
//     } catch (error) {
//         res.status(500).json({ status: "error", message: error.message });
//     }
// };