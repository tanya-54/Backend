 import { Router } from "express";
 import { loginUser, refreshAccessToken, registerUser } from "../controllers/user.controller.js";
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

 export default router;
