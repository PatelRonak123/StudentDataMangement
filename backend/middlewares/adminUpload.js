const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../utils/cloudinary");

const adminStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "admin-profiles", // different folder for institutes
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [{ width: 500, height: 500, crop: "limit" }],
  },
});

const uploadAdminProfiles = multer({ storage: adminStorage });

module.exports = uploadAdminProfiles;
