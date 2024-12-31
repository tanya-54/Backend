import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

// Get all videos with pagination, sorting, and filtering
const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query = '', sortBy = 'createdAt', sortType = 'desc', userId } = req.query;

    // Build query object
    const filters = query ? { title: { $regex: query, $options: 'i' } } : {};
    if (userId && isValidObjectId(userId)) {
        filters.userId = userId; // Filter by user if provided
    }

    const totalVideos = await Video.countDocuments(filters);
    const videos = await Video.find(filters)
        .sort({ [sortBy]: sortType === 'asc' ? 1 : -1 })
        .skip((page - 1) * limit)
        .limit(parseInt(limit));

    res.status(200).json(new ApiResponse("Videos retrieved successfully", { total: totalVideos, videos }));
});

// Publish a new video
const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description } = req.body;
    const videoFile = req.file; 
    if (!videoFile) {
        throw new ApiError(400, "Video file is required.");
    }

    // Upload video to Cloudinary
    const { secure_url: videoUrl } = await uploadOnCloudinary(videoFile.path, "videos");

    // Create video record in the database
    const video = await Video.create({
        title,
        description,
        videoUrl,
        userId: req.user._id, 
    });

    res.status(201).json(new ApiResponse("Video published successfully", video));
});

// Get a video by ID
const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID.");
    }

    const video = await Video.findById(videoId);
    
    if (!video) {
        throw new ApiError(404, "Video not found.");
    }

    res.status(200).json(new ApiResponse("Video retrieved successfully", video));
});

// Update video details
const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { title, description } = req.body;

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID.");
    }

    const video = await Video.findByIdAndUpdate(videoId, { title, description }, { new: true });
    
    if (!video) {
        throw new ApiError(404, "Video not found.");
    }

    res.status(200).json(new ApiResponse("Video updated successfully", video));
});

// Delete a video
const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID.");
    }

    const video = await Video.findByIdAndDelete(videoId);
    
    if (!video) {
        throw new ApiError(404, "Video not found.");
    }

    res.status(200).json(new ApiResponse("Video deleted successfully"));
});

// Toggle the publish status of a video
const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID.");
    }

    const video = await Video.findById(videoId);
    
    if (!video) {
        throw new ApiError(404, "Video not found.");
    }

    // Toggle the publish status
    video.isPublished = !video.isPublished;
    await video.save();

    res.status(200).json(new ApiResponse("Video publish status toggled successfully", video));
});

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
};