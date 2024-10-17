import mongoose, { isValidObjectId } from "mongoose";
import { Tweet } from "../models/tweet.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Create a new tweet
const createTweet = asyncHandler(async (req, res) => {
    const { content } = req.body; 
    const userId = req.user._id; // user ID is stored in req.user after authentication

    if (!content) {
        throw new ApiError(400, "Content is required to create a tweet.");
    }

    const tweet = await Tweet.create({ content, userId });
    res.status(201).json(new ApiResponse("Tweet created successfully", tweet));
});

// Get all tweets for a specific user
const getUserTweets = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid user ID.");
    }

    const tweets = await Tweet.find({ userId }).sort({ createdAt: -1 }); // Sort tweets by creation date
    res.status(200).json(new ApiResponse("User tweets retrieved successfully", tweets));
});

// Update a tweet by ID
const updateTweet = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;
    const { content } = req.body;

    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid tweet ID.");
    }

    const tweet = await Tweet.findByIdAndUpdate(tweetId, { content }, { new: true });

    if (!tweet) {
        throw new ApiError(404, "Tweet not found.");
    }

    res.status(200).json(new ApiResponse("Tweet updated successfully", tweet));
});

// Delete a tweet by ID
const deleteTweet = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;

    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid tweet ID.");
    }

    const tweet = await Tweet.findByIdAndDelete(tweetId);

    if (!tweet) {
        throw new ApiError(404, "Tweet not found.");
    }

    res.status(200).json(new ApiResponse("Tweet deleted successfully"));
});

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
};
