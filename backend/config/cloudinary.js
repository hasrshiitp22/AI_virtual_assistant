import { v2 as cloudinary } from 'cloudinary';
import fs from "fs"
export const uploadcloudOncloudinary=async (filepath) => {
     cloudinary.config({ 
        cloud_name: process.env.Cloud_NAME, 
        api_key: process.env.API_KEY ,
        api_secret:process.env.API_Secret // Click 'View API Keys' above to copy your API secret
    });

    try {
         const uploadResult = await cloudinary.uploader
       .upload(filepath)
       fs.unlinkSync(filepath)
       return uploadResult.secure_url
        
    } catch (error) {
         fs.unlinkSync(filepath)
         return res.stauts(500).json({message:"cloudniary error"})
    }
      

      
}
