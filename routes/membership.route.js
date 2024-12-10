import express from 'express';
import VerifyJWTToken from '../middleware/authMiddleware.js';
import {
  RegisterMembershipController,
  LoginController,
} from '../controllers/membership.controller.js';

const router = express.Router();

router.post('/registration', RegisterMembershipController);
router.post('/login', LoginController);

export default router;
