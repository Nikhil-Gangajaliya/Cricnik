import { Router } from 'express';
import {
    createPlayer,
    deletePlayer,
    updatePlayer,
    getPlayersByTeam
} from "../controllers/player.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/create-player").post(verifyJWT, createPlayer);
router.route("/delete-player/:id").delete(verifyJWT, deletePlayer);
router.route("/update-player/:id").put(verifyJWT, updatePlayer);
router.route("/get-players-by-team/:id").get(verifyJWT, getPlayersByTeam);

export default router;