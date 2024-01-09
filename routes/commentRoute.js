const express = require('express');
const router = express.Router();
const {
  createComment,
  getCommentsByReview,
  updateComment,
  deleteComment,
} = require('../controllers/commentController');


// Comment routes
router.post('/comment', createComment);
router.get('/comments/:reviewId', getCommentsByReview);
router.put('/comment/:commentId', updateComment);
router.delete('/comment/:commentId', deleteComment);

module.exports = router;
