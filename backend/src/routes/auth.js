import { Router } from 'express';
import {
  registerUserController,
  loginUserController,
  refreshUserController,
  logoutUserController,
} from '../controllers/auth.js';
import { authenticate } from '../middlewares/authenticate.js';

const router = Router();


router.post('/register', registerUserController);


router.post('/login', loginUserController);


router.post('/refresh', refreshUserController);


router.post('/logout', authenticate, logoutUserController);

export default router;