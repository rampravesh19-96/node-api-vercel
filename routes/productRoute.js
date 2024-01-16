const express = require("express");
const router = express.Router();
const {upload} = require("../middleware/multer")
const varifyToken = require("../middleware/verifyToken");
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

router.post("/product",upload.single('image'), createProduct);

// POST create multiple products
router.post("/products",upload.single("image"), createMultipleProducts);

// PUT update a product by ID
router.put("/product/:productId",upload.single('image'), updateProduct);

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
