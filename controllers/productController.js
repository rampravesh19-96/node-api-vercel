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
    // Check if an image file was provided
    if (!req.file) {
      return res.status(400).json({ error: 'Image file is required' });
    }

    // Get the Cloudinary URL of the uploaded image
    const image = req.file.path;

    // Create a new product instance
    const newProduct = new Product({
      // Access form fields directly from req.body
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,  
      category: req.body.category,
      isFeatured: req.body.isFeatured,
      image,
    });

    // Save the new product to the database
    const createdProduct = await newProduct.save();

    // Return the created product as a JSON response
    return res.status(201).json({ product: createdProduct });
  } catch (error) {
    // Handle any errors that occur during the process
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const createMultipleProducts = async (req, res) => {
  try {
    const productsArray = req.body.products;

    if (!Array.isArray(productsArray) || productsArray.length === 0) {
      return res
        .status(400)
        .json({ message: "Invalid or empty products array" });
    }

    const productsWithImages = [];

    for (const product of productsArray) {
      const imageFile = req.files && req.files.image;

      // You may want to add additional validation for the image file here

      let cloudinaryResponse;

      if (imageFile) {
        // Upload the image to Cloudinary
        cloudinaryResponse = await cloudinary.uploader.upload(imageFile.path, {
          folder: "", // Optional, specify the folder in Cloudinary
          allowed_formats: ["jpg", "jpeg", "png"],
          // You can add more configuration options as needed
        });
      }

      // Include the Cloudinary response URL in the product data
      const productWithImage = {
        ...product,
        image: cloudinaryResponse ? cloudinaryResponse.secure_url : null,
      };

      productsWithImages.push(productWithImage);
    }

    const createdProducts = await Product.insertMany(productsWithImages);

    // Return the array of created products as a JSON response
    return res.status(201).json({ products: createdProducts });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const updateProduct = async (req, res) => {
  try {
    // Find the existing product by ID
    const productId = req.params.productId;
    const existingProduct = await Product.findById(productId);

    // Check if the product with the given ID exists
    if (!existingProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Check if a new image file was provided
    if (req.file) {
      // Get the Cloudinary URL of the uploaded image
      const updatedImage = req.file.path;
      existingProduct.image = updatedImage;
    }

    // Update the product fields based on the request body
    existingProduct.title = req.body.title || existingProduct.title;
    existingProduct.description = req.body.description || existingProduct.description;
    existingProduct.price = req.body.price || existingProduct.price;
    existingProduct.category = req.body.category || existingProduct.category;
    existingProduct.isFeatured = req.body.isFeatured || existingProduct.isFeatured;

    // Save the updated product to the database
    const updatedProduct = await existingProduct.save();

    // Return the updated product as a JSON response
    return res.status(200).json({ product: updatedProduct });
  } catch (error) {
    // Handle any errors that occur during the process
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.productId;

    // Find the product by ID
    const productToDelete = await Product.findById(productId);

    // Check if the product with the given ID exists
    if (!productToDelete) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Check if the product has an associated image
    if (productToDelete.image) {
      // Use Cloudinary API to delete the product's image
      await deleteCloudinaryImg(productToDelete.image);
    }

    // Delete the product from the database
    await Product.findByIdAndDelete(productId);

    return res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    // Handle any errors that occur during the process
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteMultipleProducts = async (req, res) => {
  try {
    const productIdsToDelete = req.body.productIds; // Assuming the array of product IDs is sent in req.body.productIds

    if (!Array.isArray(productIdsToDelete) || productIdsToDelete.length === 0) {
      return res
        .status(400)
        .json({ message: "Invalid or empty productIds array" });
    }

    // Fetch the products to get their image URLs
    const productsToDelete = await Product.find({ _id: { $in: productIdsToDelete } });

    // Extract image URLs from products
    const imageUrlsToDelete = productsToDelete.map(product => product.image);

    // Delete images from Cloudinary
    for (const imageUrl of imageUrlsToDelete) {
      await deleteCloudinaryImg(imageUrl);
    }

    // Delete products from the database
    await Product.deleteMany({ _id: { $in: productIdsToDelete } });

    return res.status(200).json({ message: "Products deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};


const searchProducts = async (req, res) => {
  try {
    const searchQuery = req.query.q || '';
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sortBy = req.query.sortBy || "title";
    const sortOrder = req.query.sortOrder || "asc";
    const isFeatured = req.query.featured
    const isLatest = req.query.latest === "true" || false;

    let filter = {};

    // Additional filters based on options (featured and latest)
    if (isFeatured && (isFeatured==="true" || isFeatured==="false")) {
      filter.isFeatured = isFeatured;
    }

    const query = {
      $or: [
        { title: { $regex: searchQuery, $options: "i" } },
        { description: { $regex: searchQuery, $options: "i" } },
      ],
      ...(Object.keys(filter).length > 0 ? filter : {}), // Only include filter if it's not empty
    };

    const totalCount = await Product.countDocuments(query);
    const totalPages = Math.ceil(totalCount / limit);

    let foundProducts;

    if (isLatest) {
      // If isLatest=true, apply sorting by createdAt in descending order
      foundProducts = await Product.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);
    } else {
      // If isLatest=false or not provided, apply sorting based on sortBy and sortOrder
      foundProducts = await Product.find(query)
        .sort({ [sortBy]: sortOrder === "desc" ? -1 : 1 })
        .skip((page - 1) * limit)
        .limit(limit);
    }

    if (!foundProducts || foundProducts.length === 0) {
      return res
        .status(404)
        .json({ message: "No products found for the search query" });
    }

    return res.status(200).json({
      products: foundProducts,
      totalPages,
      currentPage: page,
      totalCount,
    });
  } catch (error) {
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
