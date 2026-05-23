import express from "express"
import { askToAssistant, getUserId, updateAssitant } from "../controllers/user.controllers.js"
import isAuth from "../middleware/IsAuth.js"
import multer from "multer"
import upload from "../middleware/multer.js"
const userRouter=express.Router()

userRouter.get("/current",isAuth,getUserId)
userRouter.post("/update",isAuth,upload.single("assistantImage"),updateAssitant)
userRouter.post("/askToAssistant",isAuth,askToAssistant)

export default userRouter