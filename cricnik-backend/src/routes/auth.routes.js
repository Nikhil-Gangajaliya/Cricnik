import { Router } from "express";
import {
    signup,
    login,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser
} from "../controllers/auth.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/change-password").post(verifyJWT, changeCurrentPassword);
router.route("/profile").get(verifyJWT, getCurrentUser);

export default router;