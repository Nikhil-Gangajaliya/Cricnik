import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import ProfileDropdown from "../components/ProfileDropdown.jsx";
import "./components.css";

export default function BottomNav() {
  const [openProfile, setOpenProfile] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="bottom-nav">

      <div onClick={() => navigate("/home")}>
        <i className="fa-solid fa-house-chimney"></i>
        <span>Home</span>
      </div>

      <div onClick={() => navigate("/all-matches")}>
        <i className="fa-solid fa-baseball-bat-ball"></i>
        <span>Matches</span>
      </div>

      <div onClick={() => navigate("/teams")}>
        <i className="fa-sharp fa-solid fa-people-group"></i>
        <span>Teams</span>
      </div>

      <div className="profile-icon" onClick={() => setOpenProfile(!openProfile)}>
        <i className="fa-solid fa-user"></i>
        <span>Profile</span>
      </div>

      <ProfileDropdown isOpen={openProfile} />

    </div>
  );
}