import mongoose , {Schema} from "mongoose";
import jwt from "jsonwebtoken" ;
import bcrypt from "bcrypt" ;


const userSchema = new Schema({

    username:{

        type: String ,
        required: true,
        unique:true,
        lowercase: true,
        trim : true,
        index: true,        //when to enable searching on the field. not every field should be made searchable
    } ,
    email:{

        type:String ,
        required:true ,
        unique:true ,
        lowercase :true ,
        trim :true , 
      
    } ,
    fullName:{

        type:String ,
        required:true,
        trim :true,
        index:true,         //when to enable searching on the field.
    } ,
    avatar:{
        type: String ,     // cloudinary Url
        required :true 

    } ,
    coverImage:{
        type:String,

    } ,

    watchHistory:[
        {
            type : Schema.Types.ObjectId ,
            ref:"Video"
        }
    ],

    password:{
        type : String,
        required: [ true, 'Password is required' ] ,
        
    },
    
    refreshToken :{
        type : String ,    
    }

     
 } , {timestamps:true}) ;


 userSchema.pre("save" ,async function () {
    if ( !this.isModified("password") ) return next();

    this.password = await bcrypt.hash(this.password , 10)   //only when password is modified.
    next()
 })

userSchema.methods.isPasswordCorrect = async function(password){
  return await bcrypt.compare(password , this.password) 
}

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            email:this.email,
            username:this.username,
            fullName :this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn :process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn : process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User" , userSchema) ;  //now mongodb will export.
