import { Router } from 'express';
import authRouter from './auth.js';
import useRouter from './user.js';
import storyRouter from './story.js'

const router = Router();

router.use('/auth', authRouter);
router.use('/users', useRouter);
router.use('/stories', storyRouter)

export default router;