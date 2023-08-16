const express = require("express");
const path = require("path");
const multer = require("../middleware/multer");
const {
  PostLogin,
  PostLogout,
  PostRegister,
  PostForgotPassword,
  PostResetPassword,
} = require("./../controllers/authController");

/** middleware */
const {
  verifySessionToken,
  checkStatus,
} = require("../middleware/authentication");

/** express */

const router = express.Router();

/** Routes */

router.post("/login", checkStatus, PostLogin);

router.post("/logout", verifySessionToken, PostLogout);

router.post("/register", multer, PostRegister);

router.post("/forgotPassword", PostForgotPassword);

router.post("/resetPassword", PostResetPassword);

router.use("/uploads", express.static(path.join(__dirname, "../uploads")));

module.exports = router;
