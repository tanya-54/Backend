import mongoose from "mongoose";
import { Video } from "../models/video.model.js";
import { Subscription } from "../models/subscription.model.js";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Get channel statistics like total video views, total subscribers, total videos, total likes, etc.
const getChannelStats = asyncHandler(async (req, res) => {
    const { channelId } = req.params;

    if (!mongoose.isValidObjectId(channelId)) {
        throw new ApiError(400, "Invalid channel ID");
    }

    const totalVideos = await Video.countDocuments({ channelId });
    const totalViews = await Video.aggregate([
        { $match: { channelId: mongoose.Types.ObjectId(channelId) } },
        { $group: { _id: null, totalViews: { $sum: "$views" } } }
    ]);
    const totalLikes = await Like.countDocuments({ channelId });
    const totalSubscribers = await Subscription.countDocuments({ channelId });

    res.status(200).json(new ApiResponse("Channel stats retrieved successfully", {
        totalVideos,
        totalViews: totalViews[0] ? totalViews[0].totalViews : 0,
        totalLikes,
        totalSubscribers
    }));
});

// Get all the videos uploaded by the channel with pagination
const getChannelVideos = asyncHandler(async (req, res) => {
    const { channelId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    if (!mongoose.isValidObjectId(channelId)) {
        throw new ApiError(400, "Invalid channel ID");
    }

    const videos = await Video.find({ channelId })
        .sort({ createdAt: -1 }) // Sort videos by newest first
        .skip((page - 1) * limit)
        .limit(parseInt(limit))
        .exec();

    const totalVideos = await Video.countDocuments({ channelId });
    const totalPages = Math.ceil(totalVideos / limit);

    res.status(200).json(new ApiResponse("Channel videos retrieved successfully", {
        videos,
        currentPage: parseInt(page),
        totalPages,
        totalVideos
    }));
});

export {
    getChannelStats,
    getChannelVideos
};
