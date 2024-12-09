import mongoose from 'mongoose';

import TransactionHistoryModel from '../models/transaction_history.model.js';
import { GetOneUserBasedOnEmail } from '../utilities/user.utitlity.js';
import { GetEmailFromToken } from '../utilities/login.utility.js';

async function GetAllTransactionHistory({ offset = 0, limit = null, token }) {
  const emailFromToken = await GetEmailFromToken({ tokenData: token });

  if (!emailFromToken) {
    return null;
  }

  offset = Math.max(parseInt(offset) || 0, 0);
  limit = limit !== null ? Math.max(parseInt(limit), 0) : null;

  const queryMatch = [{ status: 'active' }];

  const user = await GetOneUserBasedOnEmail({ email: emailFromToken });

  if (user?.email) {
    queryMatch.push({ user_id: user._id });
  }

  const query = TransactionHistoryModel.find({ $and: queryMatch }).sort({
    createdAt: -1,
  });

  if (limit != null) {
    query.skip(offset * limit).limit(limit);
  }

  const transactionHistories = await query
    .populate([{ path: 'service_id', select: 'service_name service_tariff' }])
    .lean();

  const records = transactionHistories.map((transactionHistory) => {
    return {
      invoice_number: transactionHistory?.invoice_number || '',
      transaction_type: transactionHistory?.transaction_type || '',
      description:
        transactionHistory?.service_id?.service_name ||
        transactionHistory?.description ||
        '',
      total_amount: +transactionHistory?.total_amount || 0,
      created_on: transactionHistory?.createdAt || '',
    };
  });

  return {
    status: 0,
    message: 'Get History Berhasil',
    data: {
      offset,
      limit,
      records,
    },
  };
}

export { GetAllTransactionHistory };
