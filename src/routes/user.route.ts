import { Router } from 'express';

const router = Router();

import { getProfile, loginUser, registerUser } from '../controllers/user.controller';
import verifyJWT from '../middlewares/auth.middleware';

router.route('/register').post(registerUser);

router.route('/login').post(loginUser);

router.route('/get-profile').get(verifyJWT, getProfile);

export default router;