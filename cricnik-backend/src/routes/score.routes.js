import {Router} from 'express';
import {
    addBall,
    changeBowler,
    startSecondInnings
}from "../controllers/score.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route('/add-ball').post(verifyJWT, addBall);
router.route('/change-bowler').post(verifyJWT, changeBowler);
router.route('/start-second-innings').post(verifyJWT, startSecondInnings);

export default router;