import express from 'express';
import { GetAllBannersController } from '../controllers/banner.controller.js';

import VerifyJWTToken from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/banners', VerifyJWTToken, GetAllBannersController);

export default router;
