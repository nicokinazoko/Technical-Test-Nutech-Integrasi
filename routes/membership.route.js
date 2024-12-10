import express from 'express';
import VerifyJWTToken from '../middleware/authMiddleware.js';
import {
  RegisterMembershipController,
  LoginController,
  GetOneProfileController,
} from '../controllers/membership.controller.js';

const router = express.Router();

router.post('/registration', RegisterMembershipController);
router.post('/login', LoginController);
router.get('/profile', VerifyJWTToken, GetOneProfileController);

export default router;
