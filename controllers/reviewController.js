const Review = require("../models/reviewModel");

const createReview = async (req, res) => {
  try {
    // Assuming the user ID and product ID are sent in the request body
    const { userId, productId, rating, comment } = req.body;

    const newReview = new Review({
      user: userId,
      product: productId,
      rating,
      comment,
    });

    const createdReview = await newReview.save();

    return res.status(201).json({
      review: createdReview,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

const getReviewsByProduct = async (req, res) => {
  try {
    const productId = req.params.productId;

    // Find all reviews for the product and populate the 'user' field with only '_id'
    const reviews = await Review.find({ product: productId })
      .populate({
        path: 'user',
        select: '_id', // Only include the _id field of the user
      });

    // Calculate the average rating
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;

    return res.status(200).json({
      reviews,
      averageRating,
      numberOfReviews: reviews.length,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: 'Internal server error',
    });
  }
};

const updateReview = async (req, res) => {
  try {
    const reviewId = req.params.reviewId;
    const { rating, comment } = req.body;

    const updatedReview = await Review.findByIdAndUpdate(
      reviewId,
      {
        rating,
        comment,
      },
      {
        new: true,
      }
    );

    if (!updatedReview) {
      return res.status(404).json({
        message: "Review not found",
      });
    }

    return res.status(200).json({
      review: updatedReview,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

const deleteReview = async (req, res) => {
  try {
    const reviewId = req.params.reviewId;

    const deletedReview = await Review.findByIdAndDelete(reviewId);

    if (!deletedReview) {
      return res.status(404).json({
        message: "Review not found",
      });
    }

    return res.status(200).json({
      message: "Review deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

module.exports = {
  createReview,
  getReviewsByProduct,
  updateReview,
  deleteReview,
};
