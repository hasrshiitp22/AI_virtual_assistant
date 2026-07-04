import genToken from "../config/token.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs"

export const signUp=async (req,res) => {
    try {
        const {name,email,password}=req.body;
         const existEmail= await User.findOne({email})
         if(existEmail){
            return  res.status(400).json({message:"email already exist"});
         }
         if(!password || password.length < 6){
            return  res.status(400).json({message:"password must be 6 char"});
         }
         const hashedpassword= await bcrypt.hash(password,10)
         const user=await User.create({
            name,password:hashedpassword,email
         })
         const token= await genToken(user._id)
         res.cookie("token",token,{
           httpOnly:true,
           maxAge:7*24*60*60*1000,
           sameSite:"none",
           secure:true
         })
         return res.status(201).json(user)

    } catch (error) {
        return res.status(500).json({mess:`signup error ${error}`})
    }
}

export const LogIn=async (req,res) => {
    try {
        const {email,password}=req.body;
         const existEmail= await User.findOne({email})
         if(!existEmail){
            return  res.status(400).json({message:"email not exist"});
         }
         if(password.length<6){
            return  res.status(400).json({message:"password must be 6 char"});
         }
         const pass_match=await bcrypt.compare(password,existEmail.password)

         if(!pass_match){
            return res.status(400).json({message:"incorrect match"})
         }
      
         const token= await genToken(existEmail._id)
         res.cookie("token",token,{
           httpOnly:true,
           maxAge:7*24*60*60*1000,
           sameSite:"none",
           secure:true
         })
         return res.status(200).json(existEmail);
    } catch (error) {
        return res.status(500).json({mess:`login error ${error}`})
    }
}
export const logout= async(req,res)=>{
  try {
   res.clearCookie("token")
   return res.status(200).json({message:`logout error sucessful`})
  } catch (error) {
   return res.status(500).json({message:`logout error ${error}`})
  }
}
