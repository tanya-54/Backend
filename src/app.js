import express from "express" ;
import cookieParser from "cookie-parser"
import cors from "cors" ;


const app = express() ;
app.use(cors({
    origin: process.env.CORS_ORIGIN  ,
    credentials:true 
}));
app.use(express.json({limit:"16kb"}))               // accepting the json data upto certain limit 
app.use(express.urlencoded({extended:true , limit :"16kb"}))           // now accepting the data coming as in form of url and extended true allow  the nested objects also . 
app.use(express.static("public")) ;
app.use(cookieParser()) ;                     //server se user ke web browser ki cookie access kar pau aur us pr crud operations perform ho pay



export { app } ;