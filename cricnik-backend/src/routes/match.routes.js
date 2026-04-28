import { Router } from "express";
import {
    createMatch,
    deleteMatch,
    getMatches,
    getMatchById
} from "../controllers/match.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/create-match").post(verifyJWT, createMatch);
router.route("/delete-match/:id").delete(verifyJWT, deleteMatch);
router.route("/all-matches").get(verifyJWT, getMatches);
router.route("/matches/:id").get(verifyJWT, getMatchById);

export default router;