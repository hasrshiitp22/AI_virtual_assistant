import { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Customize from "./pages/Customize";
import Customize2 from "./pages/Customize2";
import Home from "./pages/Home";
import { userDataContext } from "./context/UserContext";

function App() {
  const { userData } = useContext(userDataContext);

  return (
    <Routes>
      <Route
        path="/"
        element={userData ? <Home /> : <Navigate to="/signup" />}
      />

      <Route
        path="/signup"
        element={ <SignUp />}
      />

      <Route
        path="/signin"
        element={userData ? <Navigate to="/" /> : <SignIn />}
      />

      <Route
        path="/customize"
        element={userData ? <Customize /> : <Navigate to="/signin" />}
      />

      <Route
        path="/customize2"
        element={userData ? <Customize2 /> : <Navigate to="/signin" />}
      />
    </Routes>
  );
}

export default App;