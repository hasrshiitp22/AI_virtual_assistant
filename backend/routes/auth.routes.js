import express from "express"
import { LogIn, logout, signUp } from "../controllers/auth.controller.js"
const authRouter=express.Router()

authRouter.post("/signup",signUp)
authRouter.post("/signin",LogIn)
authRouter.get("/logout",logout)

export default authRouter
