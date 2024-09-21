import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import {ApiResponse} from "../utils/ApiResponse.js"

const registerUser = asyncHandler( async (req , res) =>{
    const {fullName ,username, email, password}= req.body;
    console.log("email:", email);
    // if (fullName === ""){
    //     throw new ApiError( 400 ,"fullname is reqiured")
    // }
    if(
        [fullName, email, username, password].some((field)=> field?.trim() ==="")
    ){
        throw new ApiError(400 ,"All fields are required") ;
    }
    const existedUser = User.findOne({
        $or: [{ username } , { email }]
    })
    if (existedUser){
        throw new ApiError(409,"username or email already exists" )
    }

const avatarLocalPath = req.files?.avatar[0]?.path ;
const coverImageLocalPath =req.files?.coverImage[0]?.path;

if(!avatarLocalPath){
    throw new ApiError(400 , "Avatar file is required ") ;
}

if(!coverImage){
    throw new ApiError(400 , "Cover Image file is required ") ;
}

const avatar = await uploadOnCloudinary(avatarLocalPath) 
const coverImage = await uploadOnCloudinary(coverImageLocalPath)

if(!avatar){
    throw new ApiError(400 , "Avatar file is required") ;
}
const user = await User.create({
    fullName,
    avatar: avatar.url ,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase()
})
 const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
 ) //by default everything is selected in .select
 if(!createdUser) {
    throw new ApiError(500 , "something went wrong while registering the user");
 }

return res.status(201).json(
    new ApiResponse(200 , createdUser, "User registered Successfully")
)

} )

// console.log("Exporting registerUser function");
export {registerUser};


/*

for registering detailes 
get user details from frontend
validation - not empty
check if user already exists: using usrname or details
check if avatar or images
if available then upload to cloudinary , avatar
create user object - create entry in db
remove password and refresh token field from response 
check for user creation.
return response


*/