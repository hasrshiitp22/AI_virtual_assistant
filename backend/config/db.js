import mongoose from "mongoose";
import dotenv from "dotenv";

const connectDb=async ()=>{
    try{
    await mongoose.connect(process.env.MONGODB_URI)
    console.log("db connected")

    }
    catch(error)
    {
      console.log("db connection error")
    }
}

export default connectDb