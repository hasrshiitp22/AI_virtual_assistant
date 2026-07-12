import React, { useContext, useEffect, useRef, useState } from "react";
import { userDataContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";


function Home() {
  const { userData, serverUrl, setUserData, getgemini } =
    useContext(userDataContext);
  const [theme, setTheme] = useState("black");
  const [userText, setUserText] = useState("");
  const [assistantText, setAssistantText] = useState("");
  const [assistantState, setAssistantState] = useState("listening");
  const [awake, setAwake] = useState(false);
const sleepTimer = useRef(null);
  const navigate = useNavigate();

  const recognitionRef = useRef(null);
  const isSpeaking = useRef(false);
  const isProcessing = useRef(false);

  // ---------------- Logout ----------------
  const handleLogout = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/logout`, {
        withCredentials: true,
      });

      setUserData(null);
      navigate("/signin");
    } catch (err) {
      console.log(err);
    }
  };


  const performAction = (data) => {
  switch (data.type) {
    case "google_search":
      window.open(
        `https://www.google.com/search?q=${encodeURIComponent(data.userInput)}`,
        "_blank"
      );
      break;

    case "youtube_search":
    case "youtube_play":
      window.open(
        `https://www.youtube.com/results?search_query=${encodeURIComponent(data.userInput)}`,
        "_blank"
      );
      break;

    case "calculator_open":
      window.open(
        "https://www.google.com/search?q=calculator",
        "_blank"
      );
      break;

    case "facebook_open":
      window.open("https://facebook.com", "_blank");
      break;

    case "instagram_open":
      window.open("https://instagram.com", "_blank");
      break;

    case "weather_show":
      window.open(
        `https://www.google.com/search?q=${encodeURIComponent(
          data.userInput || "weather"
        )}`,
        "_blank"
      );
      break;

    default:
      break;
  }
};

  // ---------------- Speak ----------------
  const speak = (text) => {
    if (!text) {
      startListening();
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    utterance.lang = "en-US";
    utterance.rate = 1;
    utterance.pitch = 1;

    const voices = window.speechSynthesis.getVoices();
    utterance.voice =
      voices.find((v) => v.lang === "en-US") || voices[0];

    utterance.onstart = () => {
      isSpeaking.current = true;
      setAssistantState("speaking");
    };

   utterance.onend = () => {
  isSpeaking.current = false;
  isProcessing.current = false;

  setAssistantState("listening");

  resetSleepTimer(); // stay awake

  setTimeout(() => {
    startListening();
  }, 300);
};

    utterance.onerror = () => {
      isSpeaking.current = false;
      isProcessing.current = false;
      startListening();
    };
    recognitionRef.current?.stop();
    window.speechSynthesis.speak(utterance);

  };

  // ---------------- Start Listening ----------------
  const startListening = () => {
    const recognition = recognitionRef.current;

    if (!recognition) return;

    try {
      recognition.start();
    } catch { }
  };
   
  const resetSleepTimer = () => {
  clearTimeout(sleepTimer.current);

  sleepTimer.current = setTimeout(() => {
    setAwake(false);
    console.log("😴 Assistant Sleeping");
  }, 20000); // Sleep after 20 seconds
};
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition is not supported.");
      return;
    }
    
    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognitionRef.current = recognition;

    const wakeWord = (
      userData?.assistantName || "alexa"
    ).toLowerCase();

    recognition.onstart = () => {
      console.log("🎤 Listening...");
      setAssistantState("listening");
    };

    recognition.onend = () => {
      if (!isSpeaking.current && !isProcessing.current) {
        setTimeout(startListening, 500);
      }
    };

    recognition.onerror = () => {
      if (!isSpeaking.current && !isProcessing.current) {
        setTimeout(startListening, 500);
      }
    };
   recognition.onresult = async (event) => {
  if (isProcessing.current) return;

  const transcript =
    event.results[event.results.length - 1][0].transcript.trim();

  if (!transcript) return;

  console.log("🎤 You:", transcript);

  setUserText(transcript);

  const wakeWord = (userData?.assistantName || "alexa").toLowerCase();

  const lowerTranscript = transcript.toLowerCase();

  // ---------------- Assistant Sleeping ----------------
  if (!awake) {
    if (!lowerTranscript.includes(wakeWord)) {
      return;
    }

    setAwake(true);
    resetSleepTimer();

    // Remove wake word
    let command = lowerTranscript
      .replace(wakeWord, "")
      .trim();

    // User only said wake word
    if (command === "") {
      speak("Yes?");
      return;
    }

    // User said:
    // Alexa what's the weather
    isProcessing.current = true;
    recognition.stop();
    setAssistantState("thinking");

    try {
      const data = await getgemini(command);

      if (data) {
        setAssistantText(data.response);
        performAction(data);
        speak(data.response);
      } else {
        speak("Sorry, I couldn't understand.");
      }
    } catch (err) {
      console.log(err);
      speak("Something went wrong.");
    }

    return;
  }

  // ---------------- Assistant Awake ----------------

  resetSleepTimer();

  isProcessing.current = true;

  recognition.stop();

  setAssistantState("thinking");

  try {
    const data = await getgemini(transcript);

    if (data) {
      setAssistantText(data.response);
      speak(data.response);
    } else {
      speak("Sorry, I couldn't understand.");
    }
  } catch (err) {
    console.log(err);
    speak("Something went wrong.");
  }
};

    navigator.mediaDevices
      .getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      })
      .then(() => startListening())
      .catch((err) => console.log(err));

    return () => {
      recognition.stop();
      window.speechSynthesis.cancel();
    };
  }, [userData]);

  return (
    <div className={`w-full h-screen bg-${theme} flex justify-center items-center flex-col relative`}>
    
      <button
        className={`absolute top-5 right-5 bg-white mx-2  border-2 border-${theme == "white" ? "black": "white"} px-8 py-2 rounded-full`}
        onClick={handleLogout}
      >
        Log Out
      </button>

      <button
        className={`absolute top-20 bg-white mx-2 right-5 border-2 border-${theme == "white" ? "black": "white"} px-6 py-2 rounded-full`}
        onClick={() => navigate("/customize")}
      >
        Customize
      </button>
    
      <button className={`${theme === "black" ? "bg-white text-black": "bg-black text-white"} absolute mx-3 rounded-3xl px-8 py-2 rounded-full m-2 top-10 left-0`} onClick={
        ()=>{
          if(theme=='black'){
            setTheme('white');
          }else{
             setTheme('black');
          }
        }
      }> {theme == "black" ? "🌞 Light Mode" : "🌙 Dark Mode"}</button>

      <div
        className={`
    w-[300px] h-[360px]
    overflow-hidden rounded-xl
    transition-all duration-500 w-10

    ${assistantState === "listening"
            ? "ring-4 ring-blue-500 animate-pulse"
            : ""
          }

    ${assistantState === "thinking"
            ? "scale-105 animate-bounce"
            : ""
          }

    ${assistantState === "speaking"
            ? "ring-4 ring-green-500 scale-110"
            : ""
          }
  `}
      > <img
          src={userData?.assistantImage}
          alt="assistant"
          className="w-full h-full object-cover"
        /></div>

      <h1 className={`${theme === "white" ? " text-black": " text-white"} text-2xl mt-4 font-semibold`}>
        I'm {userData?.assistantName}
      </h1>
      <p className={`${theme === "white" ? " text-black": " text-white"} mt-3 text-lg`}>
        {assistantState === "listening" && "🎤 Listening..."}
        {assistantState === "thinking" && "🤔 Thinking..."}
        {assistantState === "speaking" && "🗣️ Speaking..."}
      </p>
      <div className="w-[90%] max-w-2xl mt-8 space-y-4">
        {userText && (
          <div className="bg-gray-800 text-white p-4 rounded-xl">
            <p className="text-green-400 font-semibold">🎤 You</p>
            <p>{userText}</p>
          </div>
        )}

        {assistantText && (
          <div className="bg-blue-900 text-white p-4 rounded-xl">
            <p className="text-blue-300 font-semibold">🤖 Assistant</p>
            <p>{assistantText}</p>
          </div>
        )}
      </div>
    </div>

  );
}

export default Home;
