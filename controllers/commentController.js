const Comment = require('../models/commentModel');

const createComment = async (req, res) => {
  try {
    const { userId, reviewId, text, parentCommentId } = req.body; // Assuming the parentCommentId is sent for replies

    const newComment = new Comment({
      user: userId,
      review: reviewId,
      text,
      parentComment: parentCommentId || null, // Set parentComment if it's a reply
    });

    const createdComment = await newComment.save();

    return res.status(201).json({ comment: createdComment });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const getCommentsByReview = async (req, res) => {
  try {
    const reviewId = req.params.reviewId;

    const comments = await Comment.find({ review: reviewId }).populate('user');

    return res.status(200).json({ comments });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// This function retrieves replies for a specific comment (parentComment)
const getRepliesForComment = async (req, res) => {
  try {
    const parentCommentId = req.params.parentCommentId;

    const replies = await Comment.find({ parentComment: parentCommentId }).populate('user');

    return res.status(200).json({ replies });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const updateComment = async (req, res) => {
  try {
    const commentId = req.params.commentId;
    const { text } = req.body;

    const updatedComment = await Comment.findByIdAndUpdate(
      commentId,
      { text },
      { new: true }
    );

    if (!updatedComment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    return res.status(200).json({ comment: updatedComment });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteComment = async (req, res) => {
  try {
    const commentId = req.params.commentId;

    const deletedComment = await Comment.findByIdAndDelete(commentId);

    if (!deletedComment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    return res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  createComment,
  getCommentsByReview,
  getRepliesForComment, // Include this function to retrieve replies for a specific comment
  updateComment,
  deleteComment,
};
