import { Router } from "express";
import {
    createMatch,
    deleteMatch,
    getMatches,
    getMatchById,
    getRecentMatches
} from "../controllers/match.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/create-match").post(verifyJWT, createMatch);
router.route("/delete-match/:id").delete(verifyJWT, deleteMatch);
router.route("/all-matches").get(verifyJWT, getMatches);
router.route("/matches/:id").get(verifyJWT, getMatchById);
router.route("/recent-matches").get(verifyJWT, getRecentMatches);

export default router;