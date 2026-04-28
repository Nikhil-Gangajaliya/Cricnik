import { useEffect, useState } from "react";
import { getUserProfile, logoutUser, changePassword } from "../services/authService";
import { useNavigate } from "react-router-dom";
import "./components.css";

export default function ProfileDropdown({ isOpen }) {
    const [user, setUser] = useState(null);
    const [showChangePw, setShowChangePw] = useState(false);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        if (isOpen) {
            fetchProfile();
        }
    }, [isOpen]);

    const fetchProfile = async () => {
        try {
            const data = await getUserProfile();
            setUser(data.data); 
        } catch (err) {
            console.error(err);
        }
    };

    const handleChangePassword = async () => {
        try {
            await changePassword(currentPassword, newPassword);

            alert("Password changed successfully ✅");

            setShowChangePw(false);
            setCurrentPassword("");
            setNewPassword("");

        } catch (err) {
            console.error(err);
            alert("Failed to change password ❌");
        }
    };

    const handleLogout = async () => {
        await logoutUser();
        navigate("/");
    };

    if (!isOpen) return null;

    return (
        <div className="profile-dropdown">

            {!showChangePw ? (
                <>
                    <div className="profile-top">
                        <p className="profile-name">{user?.username || "User"}</p>
                    </div>

                    <div className="profile-item">
                        {user?.email}
                    </div>

                    <div
                        className="profile-item clickable"
                        onClick={() => setShowChangePw(true)}
                    >
                        Change Password
                    </div>

                    <div className="divider" />

                    <div className="profile-item logout" onClick={handleLogout}>
                        Logout
                    </div>
                </>
            ) : (
                <>
                    <div className="profile-top">
                        <p className="profile-name">Change Password</p>
                    </div>

                    <input
                        type="password"
                        placeholder="Current Password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="profile-input"
                    />

                    <input
                        type="password"
                        placeholder="New Password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="profile-input"
                    />

                    <button className="profile-btn" onClick={handleChangePassword}>
                        Update
                    </button>

                    <p
                        className="back-text"
                        onClick={() => setShowChangePw(false)}
                    >
                        ← Back
                    </p>
                </>
            )}
        </div>
    );
}