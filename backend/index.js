import express from "express"
import dotenv from "dotenv"
import connnectDb from "./config/db.js";
import cors from "cors"
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.routes.js";
dotenv.config()
import userRouter from "./routes/user.routes.js";
import geminiResponse from "./gemini.js";
const app=express();
app.use(cors({
    origin: [
        "http://localhost:5173",
        "https://harshiitp22-aivirtualassistant.vercel.app",
        "https://harshiitp22-aivirtualassistant-3e1xii5pv-hasrshiitp22s-projects.vercel.app"
    ],
    credentials: true
}));
const port=process.env.PORT||5000

app.use(express.json())
app.use(cookieParser())
app.use("/api/auth",authRouter)
app.use("/api/auth",userRouter)


app.listen(port,()=>{
    connnectDb()
    console.log(`http://localhost:${port}`);
})

