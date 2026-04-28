import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";

import CreateTeam from "./pages/CreateTeam";
import TeamView from "./pages/TeamView";
import ViewTeams from "./pages/ViewTeams";

import MatchView from "./pages/MatchView";
import CreateMatch from "./pages/CreateMatch";

import ProtectedRoute from "./components/ProtectedRoute";
import AllMatches from "./components/AllMatches.jsx";
import "./index.css";

function App() {
  return (
    <div className="device-check">

      {/* ✅ MOBILE APP */}
      <div className="mobile-app">
        <BrowserRouter>
          <Routes>

            {/* AUTH */}
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* PROTECTED */}
            <Route path="/home" element={
              <ProtectedRoute><Home /></ProtectedRoute>
            } />

            <Route path="/teams" element={
              <ProtectedRoute><ViewTeams /></ProtectedRoute>
            } />

            <Route path="/team/:id" element={
              <ProtectedRoute><TeamView /></ProtectedRoute>
            } />

            <Route path="/create-team" element={
              <ProtectedRoute><CreateTeam /></ProtectedRoute>
            } />

            <Route path="/all-matches" element={
              <ProtectedRoute><AllMatches /></ProtectedRoute>
            } />

            <Route path="/match/:id" element={
              <ProtectedRoute><MatchView /></ProtectedRoute>
            } />

            <Route path="/create-match" element={
              <ProtectedRoute><CreateMatch /></ProtectedRoute>
            } />

          </Routes>
        </BrowserRouter>
      </div>

      <div className="desktop-warning">
        <h2><i className="fa-solid fa-mobile-screen"></i> Mobile Only App</h2>
        <p>This app is optimized for mobile & tablet devices.</p>
        <p>Please open it on your phone for best experience.</p>
      </div>

    </div>
  );
}

export default App;