import React, { useContext, useEffect } from "react";
import { userDataContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Home() {
  const { userData, serverUrl, setUserData, getgemini } =
    useContext(userDataContext);

  const navigate = useNavigate();

  // Logout
  const handleLogout = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/logout`, {
        withCredentials: true,
      });

      setUserData(null);
      navigate("/signin");
    } catch (error) {
      console.log(error);
    }
  };

  // Speak Function
  const speak = (text, recognition) => {
    if (!text) return;

    // STOP listening before speaking
    recognition.stop();

    // cancel previous speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    utterance.lang = "en-US";
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onstart = () => {
      console.log("Speech started");
    };

    utterance.onend = () => {
      console.log("Speech ended");

      // restart listening after speech
      recognition.start();
    };

    utterance.onerror = (e) => {
      console.log("Speech error:", e.error);

      // restart recognition even on error
      recognition.start();
    };

    console.log("speaking:", text);

    window.speechSynthesis.speak(utterance);
  };

  // Handle Commands
  const handleCommand = (data, recognition) => {
    const { type, userInput, response } = data;

    // Speak Response
    if (response) {
      speak(response, recognition);
    }

    // Delay actions slightly
    setTimeout(() => {
      // Google Search
      if (type === "google-search") {
        const query = encodeURIComponent(userInput);

        window.open(
          `https://www.google.com/search?q=${query}`,
          "_blank"
        );
      }

      // Calculator
      if (type === "calculator_open") {
        window.open(
          `https://www.google.com/search?q=calculator`,
          "_blank"
        );
      }

      // Facebook
      if (type === "facebook_open") {
        window.open(
          "https://www.facebook.com/",
          "_blank"
        );
      }

      // Weather
      if (type === "weather_open") {
        window.open(
          `https://www.google.com/search?q=weather`,
          "_blank"
        );
      }

      // YouTube
      if (
        type === "youtube_search" ||
        type === "youtube_play"
      ) {
        const query = encodeURIComponent(userInput);

        window.open(
          `https://www.youtube.com/results?search_query=${query}`,
          "_blank"
        );
      }
    }, 1000);
  };

  // Voice Recognition
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    // Browser support check
    if (!SpeechRecognition) {
      console.log("Speech Recognition not supported");
      return;
    }

    // preload voices
    window.speechSynthesis.getVoices();

    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    const ai_name = (
      userData?.assistantName || "alexa"
    ).toLowerCase();

    recognition.onstart = () => {
      console.log("Recognition started");
    };

    recognition.onend = () => {
      console.log("Recognition ended");
    };

    recognition.onerror = (e) => {
      console.log("Recognition error:", e.error);
    };

    // User speaks
    recognition.onresult = async (e) => {
      const result =
        e.results[e.results.length - 1];

      if (!result.isFinal) return;

      const transcript = result[0].transcript
        .trim()
        .toLowerCase();

      console.log("heard:", transcript);

      // Wake word check
      if (transcript.includes(ai_name)) {
        try {
          const data = await getgemini(transcript);

          console.log("AI:", data);

          handleCommand(data, recognition);
        } catch (error) {
          console.log(error);
        }
      }
    };

    // Start listening
    recognition.start();

    // Cleanup
    return () => {
      recognition.stop();

      window.speechSynthesis.cancel();
    };
  }, []);

  return (
    <div className="w-full h-screen bg-black flex justify-center items-center flex-col relative">
      {/* Logout */}
      <button
        className="absolute top-5 right-5 bg-white px-6 py-2 rounded-full"
        onClick={handleLogout}
      >
        Log Out
      </button>

      {/* Customize */}
      <button
        className="absolute top-20 right-5 bg-white px-6 py-2 rounded-full"
        onClick={() => navigate("/customize")}
      >
        Customize
      </button>

      {/* Assistant Image */}
      <div className="w-[300px] h-[400px] overflow-hidden rounded-xl">
        <img
          src={userData?.assistantImage}
          alt="assistant"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Assistant Name */}
      <h1 className="text-white text-2xl mt-4 font-semibold">
        I'm {userData?.assistantName}
      </h1>
    </div>
  );
}

export default Home;