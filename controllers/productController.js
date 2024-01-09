const Product = require("../models/productModel");

const getProducts = async (req, res) => {
  try {
    // Fetch all products from the database
    const products = await Product.find();

    // Check if there are no products found
    if (!products || products.length === 0) {
      return res.status(404).json({ message: "No products found" });
    }

    // Return the products as a JSON response
    return res.status(200).json({ products });
  } catch (error) {
    // Handle any errors that occur during the process
    return res.status(500).json({ error: "Internal server error" });
  }
};
const getProductsByCategory = async (req, res) => {
  const category = req.params.category;

  try {
    // Find products by category in the database
    const productsByCategory = await Product.find({ category });

    // Check if there are no products found for the category
    if (!productsByCategory || productsByCategory.length === 0) {
      return res
        .status(404)
        .json({ message: "No products found for this category" });
    }

    // Return the products by category as a JSON response
    return res.status(200).json({ products: productsByCategory });
  } catch (error) {
    // Handle any errors that occur during the process
    return res.status(500).json({ error: "Internal server error" });
  }
};
const getFeaturedProducts = async (req, res) => {
  try {
    // Find featured products in the database (assuming there's a field 'isFeatured')
    const featuredProducts = await Product.find({ isFeatured: true });

    // Check if there are no featured products found
    if (!featuredProducts || featuredProducts.length === 0) {
      return res.status(404).json({ message: "No featured products found" });
    }

    // Return the featured products as a JSON response
    return res.status(200).json({ products: featuredProducts });
  } catch (error) {
    // Handle any errors that occur during the process
    return res.status(500).json({ error: "Internal server error" });
  }
};
const getLatestProducts = async (req, res) => {
  try {
    // Find the latest products in the database (assuming there's a 'createdAt' timestamp)
    const latestProducts = await Product.find()
      .sort({ createdAt: -1 })
      .limit(5);

    // Check if there are no latest products found
    if (!latestProducts || latestProducts.length === 0) {
      return res.status(404).json({ message: "No latest products found" });
    }

    // Return the latest products as a JSON response
    return res.status(200).json({ products: latestProducts });
  } catch (error) {
    // Handle any errors that occur during the process
    return res.status(500).json({ error: "Internal server error" });
  }
};
const getProductById = async (req, res) => {
  const productId = req.params.productId;

  try {
    // Find the product by ID in the database
    const product = await Product.findById(productId);

    // Check if the product with the given ID exists
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Return the product as a JSON response
    return res.status(200).json({ product });
  } catch (error) {
    // Handle any errors that occur during the process
    return res.status(500).json({ error: "Internal server error" });
  }
};
const createProduct = async (req, res) => {
  try {
    // Extract product details from the request body
    const { title, description, price, category, imageURL, isFeatured } =
      req.body;

    // Create a new product instance
    const newProduct = new Product({
      title,
      description,
      price,
      category,
      imageURL,
      isFeatured, // Add isFeatured field based on the request body
    });

    // Save the new product to the database
    const createdProduct = await newProduct.save();

    // Return the created product as a JSON response
    return res.status(201).json({ product: createdProduct });
  } catch (error) {
    // Handle any errors that occur during the process
    return res.status(500).json({ error: "Internal server error" });
  }
};
const createMultipleProducts = async (req, res) => {
  try {
    const productsArray = req.body.products; // Assuming the array of products is sent in req.body.products

    // Check if the productsArray exists and is an array
    if (!Array.isArray(productsArray) || productsArray.length === 0) {
      return res
        .status(400)
        .json({ message: "Invalid or empty products array" });
    }

    // Use insertMany() to save all products at once
    const createdProducts = await Product.insertMany(productsArray);

    // Return the array of created products as a JSON response
    return res.status(201).json({ products: createdProducts });
  } catch (error) {
    // Handle any errors that occur during the process
    return res.status(500).json({ error: "Internal server error" });
  }
};

const updateProduct = async (req, res) => {
  const productId = req.params.productId;

  try {
    // Find the product by ID in the database
    let product = await Product.findById(productId);

    // Check if the product with the given ID exists
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Update product details with incoming data from the request body
    const { title, description, price, category, imageURL, isFeatured } =
      req.body;

    // Assign new values if they exist, otherwise keep the existing values
    product.title = title || product.title;
    product.description = description || product.description;
    product.price = price || product.price;
    product.category = category || product.category;
    product.imageURL = imageURL || product.imageURL;
    product.isFeatured = isFeatured || product.isFeatured; // Update isFeatured field

    // Save the updated product details to the database
    const updatedProduct = await product.save();

    // Return the updated product as a JSON response
    return res.status(200).json({ product: updatedProduct });
  } catch (error) {
    // Handle any errors that occur during the process
    return res.status(500).json({ error: "Internal server error" });
  }
};
const deleteProduct = async (req, res) => {
  const productId = req.params.productId;

  try {
    // Find the product by ID in the database
    const product = await Product.findById(productId);

    // Check if the product with the given ID exists
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Remove the product from the database
    await product.remove();

    // Return a success message as a JSON response
    return res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    // Handle any errors that occur during the process
    return res.status(500).json({ error: "Internal server error" });
  }
};
const deleteMultipleProducts = async (req, res) => {
  try {
    const productIdsArray = req.body.productIds; // Assuming the array of product IDs is sent in req.body.productIds

    // Check if the productIdsArray exists and is an array
    if (!Array.isArray(productIdsArray) || productIdsArray.length === 0) {
      return res
        .status(400)
        .json({ message: "Invalid or empty product IDs array" });
    }

    // Delete multiple products based on their IDs
    const deletionResult = await Product.deleteMany({
      _id: { $in: productIdsArray },
    });

    // Check the deletion result for number of deleted products
    if (deletionResult.deletedCount === 0) {
      return res
        .status(404)
        .json({ message: "No products found for deletion" });
    }

    // Return a success message or deletion result as needed
    return res.status(200).json({
      message: `${deletionResult.deletedCount} products deleted successfully`,
    });
  } catch (error) {
    // Handle any errors that occur during the process
    return res.status(500).json({ error: "Internal server error" });
  }
};
const searchProducts = async (req, res) => {
  try {
    const searchQuery = req.query.q; // Search query
    const page = parseInt(req.query.page) || 1; // Current page number (default: 1)
    const limit = parseInt(req.query.limit) || 10; // Number of results per page (default: 10)
    const sortBy = req.query.sortBy || "title"; // Sorting field (default: title)
    const sortOrder = req.query.sortOrder || "asc"; // Sorting order (default: ascending)

    let filter = {}; // Add additional filters as needed based on your schema

    // Check if the search query exists
    if (!searchQuery) {
      return res.status(400).json({ message: "Invalid search query" });
    }

    // Search for products that match the search query in title or description
    const query = {
      $or: [
        { title: { $regex: searchQuery, $options: "i" } }, // Case-insensitive search in title
        { description: { $regex: searchQuery, $options: "i" } }, // Case-insensitive search in description
      ],
      ...filter, // Add additional filters here
    };

    const totalCount = await Product.countDocuments(query); // Get total count for pagination
    const totalPages = Math.ceil(totalCount / limit);

    // Apply pagination and sorting
    const foundProducts = await Product.find(query)
      .sort({ [sortBy]: sortOrder === "desc" ? -1 : 1 })
      .skip((page - 1) * limit)
      .limit(limit);

    // Check if no products match the search query
    if (!foundProducts || foundProducts.length === 0) {
      return res
        .status(404)
        .json({ message: "No products found for the search query" });
    }

    // Return the found products along with pagination details as a JSON response
    return res.status(200).json({
      products: foundProducts,
      totalPages,
      currentPage: page,
      totalCount,
      // Add more details as needed for pagination and metadata
    });
  } catch (error) {
    // Handle any errors that occur during the process
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  // Fetching products
  getProducts,
  getProductById,
  getProductsByCategory,
  getFeaturedProducts,
  getLatestProducts,

  // Managing products
  createProduct,
  createMultipleProducts,
  updateProduct,
  deleteProduct,
  deleteMultipleProducts,

  // Additional functionalities
  searchProducts,
};
