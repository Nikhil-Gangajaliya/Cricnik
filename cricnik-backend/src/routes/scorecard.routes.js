import {Router} from 'express';
import{
    getScorecard
}from "../controllers/scorecard.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route('/scorecard/:matchId').get(verifyJWT, getScorecard);

export default router;