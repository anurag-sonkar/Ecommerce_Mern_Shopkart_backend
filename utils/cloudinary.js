const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const cloudinaryUploadImg = async (fileToUploads) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(fileToUploads, { resource_type: "auto" }, (error, result) => {
      if (error) {
        console.error('Upload Error:', error);
        reject(error);
      } else {
        resolve({
          url: result.secure_url,
          asset_id: result.asset_id,
          public_id: result.public_id,
        });
      }
    });
  });
};

const cloudinaryDeleteImg = async (fileToDelete) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(fileToDelete, (error, result) => {
      if (error) {
        console.error('Delete Error:', error);
        reject(error);
      } else if (result) {
        resolve({
          url: result.secure_url,
          asset_id: result.asset_id,
          public_id: result.public_id,
        });
      } else {
        reject(new Error('Failed to delete image from Cloudinary'));
      }
    });
  });
};

// const generateUrl = (publicId) => {
//   // Generate URL with optimization
//   const optimizedUrl = cloudinary.url(publicId, {
//     fetch_format: "auto", // Automatically choose format
//     quality: "auto", // Automatically adjust quality
//   });

//   // Generate URL with transformation (e.g., cropping)
//   const transformedUrl = cloudinary.url(publicId, {
//     crop: "fill", // Crop to fill
//     width: 500,
//     height: 500,
//   });

//   console.log("Optimized URL:", optimizedUrl);
//   console.log("Transformed URL:", transformedUrl);

//   return { optimizedUrl, transformedUrl };
// };


module.exports = {cloudinaryUploadImg,cloudinaryDeleteImg}