import { Router } from "express";
import { getAllStoriesController, addToFavoritesController, removeFromFavoritesController, getFavoritesController, getMyStoriesController, createStoryController, updateStoryController } from "../controllers/story.js";
import { authenticate } from "../middlewares/authenticate.js";
import { upload } from "../middlewares/upload.js";

const router = Router();

router.get('/', getAllStoriesController);
router.get('/favorites', authenticate, getFavoritesController);
router.get('/my', authenticate, getMyStoriesController);
router.post('/', authenticate, upload.single('img'), createStoryController)
router.patch('/:id', authenticate, upload.single('img'), updateStoryController);
router.post('/:id/favorites', authenticate, addToFavoritesController );
router.delete('/:id/favorites', authenticate, removeFromFavoritesController );


export default router;