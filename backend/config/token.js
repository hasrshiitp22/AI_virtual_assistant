import jwt from "jsonwebtoken"
import dotenv from "dotenv";

const genToken =async (userId) => {
    try {
        const token=await jwt.sign({userId},process.env.JWT_SECRET,{expiresIn:"7d"})
        return token;
    } catch (error) {
        console.log("token gen failed")
    }
}
export default genToken