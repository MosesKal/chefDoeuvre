const express = require("express");
const path = require("path");
const uploadImageProduit = require("../middleware/uploadImageProduit");
const {
  createProduct,
  createCategorie,
  getCotationDetails,
  getAllCotations,
  addStock,
  getAllStocksByUser,
  updateStock,
  deleteStock,
  getProduitsCategories,
  getAllCategories,
} = require("./../controllers/selerController");

const route = express.Router();
//Product
route.post("/createProduct", uploadImageProduit, createProduct);
route.post("/createCategorie", uploadImageProduit, createCategorie);

//Cotations
route.get("/getCotation/:cotationId", getCotationDetails);
route.get("/getAllCotations", getAllCotations);

//Stock
route.post("/addStock", addStock);
route.get("/getAllStocksByUser/:userId", getAllStocksByUser);
route.put("/updateStockById/:stockId", updateStock);
route.delete("/deleteStockById/:stockId", deleteStock);

//Produits
route.get("/getProduitsCategories", getProduitsCategories);
route.get("/getAllCategories", getAllCategories);

// route.get('/getAllProductsByUser/:userId', getAllProductsByUser);

route.use(
  "/imagesProduct",
  express.static(path.join(__dirname, "../imagesProduct"))
);

module.exports = route;
