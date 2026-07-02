import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { userDataContext } from "../context/UserContext";
import axios from "axios";

function SignIn() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  const { serverUrl, setUserData } = useContext(userDataContext);

  const handleSignin = async (e) => {
    e.preventDefault();
    setErr("");

    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/signin`,
        {
          email,
          password,
        },
        {
          withCredentials: true,
        }
      );

      // Save user in Context
      setUserData(result.data);

      // Save user in localStorage
      localStorage.setItem("user", JSON.stringify(result.data));

      // Go to Home page
      navigate("/");
    } catch (error) {
      console.log(error);

      setUserData(null);

      if (error.response) {
        setErr(error.response.data.message);
      } else {
        setErr("Server is not running.");
      }
    }
  };

  return (
    <div
      className="w-full h-[100vh] bg-cover flex justify-center items-center"
      style={{
        backgroundImage:
          "url(https://wallpapercave.com/wp/wp1913262.jpg)",
      }}
    >
      <form
        className="w-[90%] h-[450px] max-w-[400px] bg-[#00000018] backdrop-blur shadow-black flex flex-col items-center justify-center"
        onSubmit={handleSignin}
      >
        <h1 className="text-white text-3xl mb-12">
          Login to{" "}
          <span className="text-blue-400 text-2xl">
            Virtual Assistant
          </span>
        </h1>

        <input
          className="text-white border-2 border-white bg-transparent w-[70%] h-8 rounded-2xl px-4 text-sm mb-4"
          type="email"
          placeholder="Enter your email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="text-white border-2 border-white bg-transparent w-[70%] h-8 rounded-2xl px-4 text-sm mb-8"
          type="password"
          placeholder="Enter your password"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
        />

        {err && (
          <p className="text-red-500 mb-3">
            * {err}
          </p>
        )}

        <button
          type="submit"
          className="h-8 rounded-full bg-white text-black w-24 cursor-pointer"
        >
          Sign In
        </button>

        <p className="text-white text-sm mt-10">
          Create a New account?
          <span
            className="ml-2 text-blue-400 font-bold cursor-pointer"
            onClick={() => navigate("/signup")}
          >
            Sign Up
          </span>
        </p>
      </form>
    </div>
  );
}

export default SignIn;