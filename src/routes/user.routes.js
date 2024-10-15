 import { Router } from "express";
 import { getUserChannelProfile, getWatchHistory, loginUser, refreshAccessToken, registerUser, updateAccountDetails, updateUserAvatar, updateUserCoverImage } from "../controllers/user.controller.js";
 import { upload } from "../middlewares/multer.middleware.js";
 import express from 'express';
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

 router.route("/register").post(
    upload.fields([   //uploads is coming from multer so it provides various methods  & now we can send images.
        {
            name:"avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount : 1
        }
     ]),
 registerUser)

router.route("/login").post(loginUser)

//secured Routes
router.route("/logout").post(verifyJWT,  logoutUser)
router.route("/refreshToken").post(refreshAccessToken)
router.route("/current-user").get(verifyJWT,getCurrentUser)
router.route("/update-account").patch(verifyJWT,updateAccountDetails)
router.route("/avatar").patch(verifyJWT , upload.single("avatar"))
router.route("/cover-image").patch(verifyJWT ,upload.single("/coverImage"),updateUserCoverImage)
router.route("/c/:username").get(verifyJWT,getUserChannelProfile)
router.route("/history").get(verifyJWT ,getWatchHistory)


 export default router;
