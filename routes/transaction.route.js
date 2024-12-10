import express from 'express';

import VerifyJWTToken from '../middleware/authMiddleware.js';

import {
  GetBalanceFromUserController,
  GetTransactionHistoriesContrroller,
  TopUpBalanceForUserController,
} from '../controllers/transaction.controller.js';

const router = express.Router();

router.get('/balance', VerifyJWTToken, GetBalanceFromUserController);
router.get(
  '/transaction/history',
  VerifyJWTToken,
  GetTransactionHistoriesContrroller
);

router.post('/topup', VerifyJWTToken, TopUpBalanceForUserController);
export default router;
