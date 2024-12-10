import express from 'express';
import VerifyJWTToken from '../middleware/authMiddleware.js';
import { RegisterMembershipController } from '../controllers/membership.controller.js';

const router = express.Router();

router.post('/registration', RegisterMembershipController);

export default router;
