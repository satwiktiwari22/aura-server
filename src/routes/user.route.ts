import { Router } from 'express';

const router = Router();

import { loginUser, registerUser } from '../controllers/user.controller';

router.route('/register').post(registerUser);

router.route('/login').post(loginUser);

export default router;