import express from 'express';
import { GetAllBannersController } from '../controllers/banner.controller.js';
import { GetAllServicesController } from '../controllers/service.controller.js';

import VerifyJWTToken from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/banners', GetAllBannersController);
router.get('/services', VerifyJWTToken, GetAllServicesController);

export default router;
