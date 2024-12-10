import express from 'express';
import VerifyJWTToken from '../middleware/authMiddleware.js';
import {
  RegisterMembershipController,
  LoginController,
  GetOneProfileController,
  UpdateMemberController,
} from '../controllers/membership.controller.js';

const router = express.Router();

router.post('/registration', RegisterMembershipController);
router.post('/login', LoginController);
router.get('/profile', VerifyJWTToken, GetOneProfileController);
router.get('/profile/update', VerifyJWTToken, UpdateMemberController);

export default router;
