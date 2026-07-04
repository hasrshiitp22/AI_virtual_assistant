import React, { createContext, useEffect, useState } from 'react'
import axios from "axios"

export const userDataContext = createContext()

function UserContext({ children }) {

  const serverUrl = "https://ai-virtual-assistant-r1yt.onrender.com";
  
  const [userData, setUserData] = useState(null)
  const [frontendImage, setfrontendImage] = useState(null)
  const [backendImage, setbackendImage] = useState(null)
  const [SelectedImage, setSelectedImage] = useState(null)

  const handleCurrentUser = async () => {
    try {
      const result = await axios.get(
        `${serverUrl}/api/auth/current`,
        { withCredentials: true }
      )

      setUserData(result.data)
      console.log("USER:", result.data)

    } catch (error) {
      console.log("USER FETCH ERROR:", error.response?.data || error.message)
    }
  }

  const getgemini = async (command) => {
    try {

      if (!command || typeof command !== "string") {
        console.log("Invalid prompt:", command)
        return
      }

      console.log("SENDING:",command)

      const result = await axios.post(
        `${serverUrl}/api/auth/askToAssistant`,
        { message: command},
        { withCredentials: true }
      )

      return result.data

    } catch (error) {
    
      console.log("GEMINI FRONTEND ERROR:", error.response?.data || error.message)
    }
  }

  useEffect(() => {
    handleCurrentUser()
  }, [])

  const value = {
    serverUrl,
    userData,
    setUserData,
    frontendImage,
    setfrontendImage,
    backendImage,
    setbackendImage,
    SelectedImage,
    setSelectedImage,
    getgemini
  }

  return (
    // ✅ FIX 3: removed unnecessary div
    <userDataContext.Provider value={value}>
      {children}
    </userDataContext.Provider>
  )
}

export default UserContext
