const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../utils/cloudinary");

const documentStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const originalNameWithoutExt = file.originalname
      .split(".")
      .slice(0, -1)
      .join(".");
    return {
      folder: "student-applications",
      resource_type: "raw",
      public_id: originalNameWithoutExt, // this sets the public ID same as filename
      allowed_formats: ["pdf", "doc", "docx"],
    };
  },
});

const uploadDocuments = multer({ storage: documentStorage });

module.exports = uploadDocuments;
