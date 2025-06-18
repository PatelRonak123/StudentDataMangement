const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../utils/cloudinary");

const instituteStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "institute-logos", // different folder for institutes
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [{ width: 500, height: 500, crop: "limit" }],
  },
});

const uploadInstituteLogo = multer({ storage: instituteStorage });

module.exports = uploadInstituteLogo;
