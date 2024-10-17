import mongoose from "mongoose";
import { User } from "../models/user.model.js";
import { Subscription } from "../models/subscription.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Toggle subscription to a channel
const toggleSubscription = asyncHandler(async (req, res) => {
    const { channelId } = req.params;
    const userId = req.user._id; 
    
    if (!mongoose.isValidObjectId(channelId)) {
        throw new ApiError(400, "Invalid channel ID");
    }

    const existingSubscription = await Subscription.findOne({ channelId, subscriberId: userId });

    if (existingSubscription) {
        // If the subscription exists, remove it (unsubscribe)
        await existingSubscription.remove();
        res.status(200).json(new ApiResponse("Unsubscribed from the channel successfully"));
    } else {
        // If the subscription doesn't exist, create a new one (subscribe)
        await Subscription.create({ channelId, subscriberId: userId });
        res.status(201).json(new ApiResponse("Subscribed to the channel successfully"));
    }
});

// Get the list of subscribers for a specific channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const { channelId } = req.params;

    if (!mongoose.isValidObjectId(channelId)) {
        throw new ApiError(400, "Invalid channel ID");
    }

    const subscribers = await Subscription.find({ channelId }).populate('subscriberId', 'username email');
    res.status(200).json(new ApiResponse("Subscriber list retrieved successfully", subscribers));
});

// Get the list of channels to which a user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const userId = req.user._id; // Assuming the user ID is stored in req.user after authentication

    const subscriptions = await Subscription.find({ subscriberId: userId }).populate('channelId', 'channelName');
    res.status(200).json(new ApiResponse("Subscribed channels retrieved successfully", subscriptions));
});

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
};
