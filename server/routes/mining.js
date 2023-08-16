const express = require("express");
const {
  getDataMining,
  createCotation,
  getProduits
} = require("./../controllers/miningController");

const router = express.Router();

router.get("/getDataMining/:token", getDataMining);
router.post("/createCotation", createCotation);
router.get("/getProduits", getProduits);

module.exports = router;
