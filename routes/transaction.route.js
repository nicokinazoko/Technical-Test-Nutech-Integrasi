import express from 'express';

import VerifyJWTToken from '../middleware/authMiddleware.js';

import { GetBalanceFromUserController } from '../controllers/transaction.controller.js';

const router = express.Router();

router.get('/balance', VerifyJWTToken, GetBalanceFromUserController);

export default router;
