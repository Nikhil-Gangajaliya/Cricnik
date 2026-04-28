import {Router} from 'express';
import{
    startMatch
}from "../controllers/startMatch.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route('/startmatch/:id').post(verifyJWT, startMatch);

export default router;