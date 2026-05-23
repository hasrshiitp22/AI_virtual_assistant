import { uploadcloudOncloudinary } from "../config/cloudinary.js"
import geminiResponse from "../gemini.js"
import User from "../models/user.model.js"
import moment from "moment"

// ✅ GET USER
export const getUserId = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password")

    if (!user) {
      return res.status(400).json({ message: "user not found" })
    }

    return res.status(200).json(user)

  } catch (error) {
    return res.status(400).json({ message: "get current user error" })
  }
}

// ✅ UPDATE ASSISTANT
export const updateAssitant = async (req, res) => {
  try {
    const { assistantName, imageUrl } = req.body

    let assistantImage
    if (req.file) {
      assistantImage = await uploadcloudOncloudinary(req.file.path)
    } else {
      assistantImage = imageUrl
    }

    const user = await User.findByIdAndUpdate(
      req.userId,
      { assistantImage, assistantName },
      { new: true }
    ).select("-password")

    return res.status(200).json(user)

  } catch (error) {
    return res.status(400).json({ message: "update assistant error" })
  }
}

// ✅ ASK ASSISTANT
export const askToAssistant = async (req, res) => {
  try {
    const { message } = req.body

    // 🔥 FIX 1: safety check
    if (!message || typeof message !== "string") {
      return res.json({
        type: "general",
        userInput: "",
        response: "I didn't hear anything properly."
      })
    }

    const command = message

    const user = await User.findById(req.userId)
    if (!user) {
      return res.json({
        type: "general",
        userInput: message,
        response: "User not found"
      })
    }

    const userName = user.name
    const assistantName = user.assistantName

    const result = await geminiResponse(command, userName, assistantName)

    // 🔥 FIX 2: result safety
    if (!result) {
      return res.json({
        type: "general",
        userInput: message,
        response: "AI is not responding right now."
      })
    }

    const jsonMatch = result.match(/{[\s\S]*}/)

    // 🔥 FIX 3: don't send 400
    if (!jsonMatch) {
      return res.json({
        type: "general",
        userInput: message,
        response: result || "I can't understand"
      })
    }

    const gemResult = JSON.parse(jsonMatch[0])
    const type = gemResult.type

    switch (type) {
      case "get_date":
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: `current date is ${moment().format("YYYY-MM-DD")}`
        })

      case "get_time":
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: `current time is ${moment().format("hh:mm:ss A")}`
        })

      case "get_day":
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: `today is ${moment().format("dddd")}`
        })

      case "get_month":
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: `current month is ${moment().format("MMMM")}`
        })

      case "general":
      case "google_search":
      case "youtube_search":
      case "youtube_play":
      case "calculator_open":
      case "instagram_open":
      case "facebook_open":
      case "weather_show":
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: gemResult.response
        })

      default:
        return res.json({
          type: "general",
          userInput: message,
          response: "I didn't understand that"
        })
    }

  } catch (error) {
    console.log("ASK ERROR:", error)

    return res.json({
      type: "general",
      userInput: "",
      response: "Something went wrong"
    })
  }
}