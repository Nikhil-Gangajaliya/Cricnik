import { Router } from 'express';
import {
    createTeam,
    deleteTeam,
    updateTeam,
    getTeams
} from "../controllers/team.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route('/createteam').post(verifyJWT, createTeam);
router.route('/deleteteam/:id').delete(verifyJWT, deleteTeam);
router.route('/updateteam/:id').put(verifyJWT, updateTeam);
router.route('/getteams').get(verifyJWT, getTeams);

export default router;