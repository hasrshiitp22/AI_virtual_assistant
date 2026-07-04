import mongoose from "mongoose";
import dotenv from "dotenv";

const connectDb=async ()=>{
    try{
    await mongoose.connect(process.env.MONGODB_URI)
    console.log("db connected")

    }
    catch(error)
    {
     console.error("❌ DB Connection Error:", error.message);
    console.error(error);
    process.exit(1);
    }
}

export default connectDb
