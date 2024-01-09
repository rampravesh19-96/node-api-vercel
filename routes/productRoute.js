const express = require("express");
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsByCategory,
  getFeaturedProducts,
  getLatestProducts,
  searchProducts,
  createMultipleProducts,
  deleteMultipleProducts
} = require("../controllers/productController");

// GET all products
router.get("/products", getProducts);

// GET a single product by ID
router.get("/product/:productId", getProductById);

// POST create a new product
router.post("/product", createProduct);

// POST create multiple products
router.post("/products", createMultipleProducts);

// PUT update a product by ID
router.put("/product/:productId", updateProduct);

// DELETE a product by ID
router.delete("/product/:productId", deleteProduct);

// DELETE multiple product
router.delete("/products", deleteMultipleProducts);

// Other potential routes based on functionalities:
// GET products by category
router.get("/products/category/:category", getProductsByCategory);

// GET featured products
router.get("/products/featured", getFeaturedProducts);

// GET latest products
router.get("/products/latest", getLatestProducts);

// POST search products
router.post('/products/search', searchProducts);

module.exports = router;
