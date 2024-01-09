const express = require('express');
const router = express.Router();
const {
  createReview,
  getReviewsByProduct,
  updateReview,
  deleteReview,

} = require('../controllers/reviewController');

// Review routes
router.post('/review', createReview);
router.get('/reviews/:productId', getReviewsByProduct);
router.put('/review/:reviewId', updateReview);
router.delete('/review/:reviewId', deleteReview);


module.exports = router;
