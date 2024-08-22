// const multer = require("multer");

// // img storage path
// const imgconfig = multer.diskStorage({
//     destination:(req,file,callback)=>{
//         callback(null,"./uploads")
//     },
//     filename:(req,file,callback)=>{
//         callback(null,`${Date.now()}-${file.originalname}`)
//     }
// })

// // img filter
// const isImage = (req,file,callback)=>{
//     if(file.mimetype.startsWith("image")){
//         callback(null,true)
//     }else{
//         callback(new Error("only images is allowd"))
//     }
// }

// const upload = multer({
//     storage:imgconfig,
//     fileFilter:isImage
// });

// module.exports = upload.single("photo") // same as formData passed from frontend

const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../public/images/profile"));
  },
  filename: function (req, file, cb) {
    cb(null,  `image-${Date.now()}.${file.originalname}`);
  },
});

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb({ error: "Unsupported file format" }, false);
  }
};

const uploadProfile = multer({
  storage: storage,
  fileFilter: multerFilter,
  limits: { fileSize: 1024 * 1024  },
});

// const profileImgResize = async (req, res, next) => {
//   if (!req.files) return next();
//   await Promise.all(
//     req.files.map(async (file) => {
//       await sharp(file.path)
//         .resize(300, 300)
//         .toFormat("jpeg")
//         .jpeg({ quality: 90 })
//         .toFile(`public/images/profile/${file.filename}`);
//     //   fs.unlinkSync(`public/images/profile/${file.filename}`);
//     })
//   );
// //   console.log("resize done")
//   next();
// };


module.exports = { uploadProfile };