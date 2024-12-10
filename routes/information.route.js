import express from 'express';
import { GetAllBannersController } from '../controllers/banner.controller.js';

const router = express.Router();

router.get('/banners', GetAllBannersController);

export default router;
