import mongoose from "mongoose";
import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Get all comments for a video with pagination
const getVideoComments = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    if (!mongoose.isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    const comments = await Comment.find({ videoId })
        .sort({ createdAt: -1 }) // Sort comments by newest first
        .skip((page - 1) * limit)
        .limit(parseInt(limit))
        .exec();

    const totalComments = await Comment.countDocuments({ videoId });
    const totalPages = Math.ceil(totalComments / limit);

    res.status(200).json(new ApiResponse("Comments retrieved successfully", {
        comments,
        currentPage: parseInt(page),
        totalPages,
        totalComments
    }));
});

// Add a comment to a video
const addComment = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { text } = req.body;
    const userId = req.user.id; // Assuming the user ID is stored in req.user

    if (!mongoose.isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    if (!text) {
        throw new ApiError(400, "Comment text is required");
    }

    const newComment = await Comment.create({
        videoId,
        userId,
        text,
        createdAt: new Date()
    });

    res.status(201).json(new ApiResponse("Comment added successfully", newComment));
});

// Update a comment
const updateComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const { text } = req.body;
    const userId = req.user.id; // Assuming the user ID is stored in req.user

    if (!mongoose.isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid comment ID");
    }

    const comment = await Comment.findOne({ _id: commentId, userId });

    if (!comment) {
        throw new ApiError(404, "Comment not found or you don't have permission to update this comment");
    }

    comment.text = text || comment.text; // Update the comment text if provided
    comment.updatedAt = new Date();
    await comment.save();

    res.status(200).json(new ApiResponse("Comment updated successfully", comment));
});

// Delete a comment
const deleteComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const userId = req.user.id; // Assuming the user ID is stored in req.user

    if (!mongoose.isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid comment ID");
    }

    const comment = await Comment.findOneAndDelete({ _id: commentId, userId });

    if (!comment) {
        throw new ApiError(404, "Comment not found or you don't have permission to delete this comment");
    }

    res.status(200).json(new ApiResponse("Comment deleted successfully", comment));
});

export {
    getVideoComments,
    addComment,
    updateComment,
    deleteComment
};
