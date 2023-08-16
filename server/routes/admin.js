const express = require("express");
const {
  PostRegisterMining,
  createAddress,
} = require("./../controllers/adminController");
const path = require("path");
const uploadImage = require("../middleware/uploadImage");

const route = express.Router();


route.post("/registerMining", uploadImage, PostRegisterMining);
route.post("/createAddress", createAddress);

route.put("/validerInscription");

route.use("/images", express.static(path.join(__dirname, "../images")));

module.exports = route;
