import express from 'express';

import VerifyJWTToken from '../middleware/authMiddleware.js';

import {
  GetBalanceFromUserController,
  GetTransactionHistoriesContrroller,
} from '../controllers/transaction.controller.js';

const router = express.Router();

router.get('/balance', VerifyJWTToken, GetBalanceFromUserController);
router.get(
  '/transaction/history',
  VerifyJWTToken,
  GetTransactionHistoriesContrroller
);
export default router;
