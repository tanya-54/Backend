// require('dotenv').config({path:'./env'}) ;
import dotenv from "dotenv";
import connectDB from "./db/index.js" ;                  // here we imported the function and we just executed it
dotenv.config({
    path:'./env'
})


connectDB()
.then(() =>{
    app.on("error" , (error)=> {
        console.log("Error :", error )
        throw error 
    });
    app.listen(process.env.PORT || 8000 , ()=>{
        console.log(`Server is running at port: ${process.env.PORT}`);
    }) ;
})
.catch((error) =>{
    console.log(`MongoDb Connection failed !!! :${error}`) ;
})

















import mongoose from "mongoose";
import { DB_NAME} from "./constants.js" ;          // here we are importing database name that we mentioned in constants file and 
import express from "express";
const app = express() ;

// always use async await and also use try catch to avoid errors
/*sabse phle to ye ek iife hai aur hamesha try catch me wrap karenge apne code ko to avoid error it is a good practice 
*/
 
;( async () =>{ 
    try{
        await mongoose.connect(`${process.env.MONGODB_URI}/${ DB_NAME }`);
        app.on("error" , (error)=>{
            console.log("errr:", error);
            throw error 
        })

        app.listen(process.env.PORT , () =>{
            console.log(`App is listening on port:${process.env.PORT}`)
        });
    }catch(error){
        console.error("ERROR" , error);
    }

})()