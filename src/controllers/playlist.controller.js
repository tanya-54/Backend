import mongoose from "mongoose";
import { Playlist } from "../models/playlist.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Create a new playlist
const createPlaylist = asyncHandler(async (req, res) => {
    const { name, description } = req.body;
    const userId = req.user._id; // Assuming the user ID is stored in req.user after authentication

    const newPlaylist = await Playlist.create({ name, description, userId });
    res.status(201).json(new ApiResponse("Playlist created successfully", newPlaylist));
});

// Get all playlists for a specific user
const getUserPlaylists = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    if (!mongoose.isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid user ID");
    }

    const playlists = await Playlist.find({ userId });
    res.status(200).json(new ApiResponse("User playlists retrieved successfully", playlists));
});

// Get a playlist by its ID
const getPlaylistById = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;

    if (!mongoose.isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlist ID");
    }

    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
        throw new ApiError(404, "Playlist not found");
    }

    res.status(200).json(new ApiResponse("Playlist retrieved successfully", playlist));
});

// Add a video to a playlist
const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params;

    if (!mongoose.isValidObjectId(playlistId) || !mongoose.isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid playlist ID or video ID");
    }

    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
        throw new ApiError(404, "Playlist not found");
    }

    if (playlist.videos.includes(videoId)) {
        throw new ApiError(400, "Video already exists in the playlist");
    }

    playlist.videos.push(videoId);
    await playlist.save();

    res.status(200).json(new ApiResponse("Video added to playlist successfully", playlist));
});

// Remove a video from a playlist
const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params;

    if (!mongoose.isValidObjectId(playlistId) || !mongoose.isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid playlist ID or video ID");
    }

    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
        throw new ApiError(404, "Playlist not found");
    }

    playlist.videos = playlist.videos.filter((id) => id.toString() !== videoId);
    await playlist.save();

    res.status(200).json(new ApiResponse("Video removed from playlist successfully", playlist));
});

// Delete a playlist
const deletePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;

    if (!mongoose.isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlist ID");
    }

    const playlist = await Playlist.findByIdAndDelete(playlistId);
    if (!playlist) {
        throw new ApiError(404, "Playlist not found");
    }

    res.status(200).json(new ApiResponse("Playlist deleted successfully"));
});

// Update a playlist's name and description
const updatePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;
    const { name, description } = req.body;

    if (!mongoose.isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlist ID");
    }

    const playlist = await Playlist.findByIdAndUpdate(
        playlistId,
        { name, description },
        { new: true, runValidators: true }
    );
    if (!playlist) {
        throw new ApiError(404, "Playlist not found");
    }

    res.status(200).json(new ApiResponse("Playlist updated successfully", playlist));
});

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
};
