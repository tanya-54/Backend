import mongoose, { isValidObjectId } from "mongoose";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Toggle like on a video
const toggleVideoLike = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const userId = req.user.id; // Assuming user ID is stored in req.user

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    const existingLike = await Like.findOne({ userId, videoId });

    if (existingLike) {
        // If like exists, remove it (dislike)
        await existingLike.remove();
        res.status(200).json(new ApiResponse("Video like removed successfully", false));
    } else {
        // If like doesn't exist, create a new like
        await Like.create({ userId, videoId });
        res.status(200).json(new ApiResponse("Video liked successfully", true));
    }
});

// Toggle like on a comment
const toggleCommentLike = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const userId = req.user.id; // Assuming user ID is stored in req.user

    if (!isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid comment ID");
    }

    const existingLike = await Like.findOne({ userId, commentId });

    if (existingLike) {
        // If like exists, remove it (dislike)
        await existingLike.remove();
        res.status(200).json(new ApiResponse("Comment like removed successfully", false));
    } else {
        // If like doesn't exist, create a new like
        await Like.create({ userId, commentId });
        res.status(200).json(new ApiResponse("Comment liked successfully", true));
    }
});

// Toggle like on a tweet
const toggleTweetLike = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;
    const userId = req.user.id; // Assuming user ID is stored in req.user

    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid tweet ID");
    }

    const existingLike = await Like.findOne({ userId, tweetId });

    if (existingLike) {
        // If like exists, remove it (dislike)
        await existingLike.remove();
        res.status(200).json(new ApiResponse("Tweet like removed successfully", false));
    } else {
        // If like doesn't exist, create a new like
        await Like.create({ userId, tweetId });
        res.status(200).json(new ApiResponse("Tweet liked successfully", true));
    }
});

// Get all liked videos
const getLikedVideos = asyncHandler(async (req, res) => {
    const userId = req.user.id; // Assuming user ID is stored in req.user

    const likedVideos = await Like.find({ userId, videoId: { $exists: true } })
        .populate('videoId') // Assuming 'videoId' is a reference to the video document
        .exec();

    res.status(200).json(new ApiResponse("Liked videos retrieved successfully", likedVideos));
});

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
};
