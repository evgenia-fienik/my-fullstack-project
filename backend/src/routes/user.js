import { Router } from "express";
import { getCurrentUserController, updateCurrentUserController, getAllUsersController, getUserByIdController, verifyEmailController} from "../controllers/user.js";
import { authenticate } from "../middlewares/authenticate.js";
import { upload } from '../middlewares/upload.js'

const router = Router ();


router.get('/me', authenticate, getCurrentUserController);

router.patch('/me', authenticate, upload.single('avatar'), updateCurrentUserController);

router.get('/', getAllUsersController);

router.get('/verify-email', verifyEmailController);

router.get('/:id', getUserByIdController);

export default router;