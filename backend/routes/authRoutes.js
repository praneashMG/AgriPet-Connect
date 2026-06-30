const express = require("express");

const router = express.Router();

const {
  register,
  login,
  profile,
  uploadProfileImage,
} = require("../controllers/authController");

const authMiddleware = require("../middleware/authMiddleware");
const multer = require("multer");
const path = require("path");

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Not an image! Please upload an image."), false);
    }
  },
});

router.post("/register", register);

router.post("/login", login);

router.get(
  "/profile",
  authMiddleware,
  profile
);

router.post(
  "/profile-image",
  authMiddleware,
  upload.single("image"),
  uploadProfileImage
);

module.exports = router;