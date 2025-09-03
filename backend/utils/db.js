import mongoose from "mongoose";
import dotenv from 'dotenv'

const connectDB = async()=>{
    try {
        await mongoose.connect(process.env.DB_URI)
        console.log("MongoDB Connected Successfully")
    } 
    catch (error) {
        console.log("MongoDB Connection Failed",error.message);
        process.exit(1)
    }
};

export {connectDB}