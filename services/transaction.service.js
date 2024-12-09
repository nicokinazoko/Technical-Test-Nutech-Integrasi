import UserModel from '../models/user.model.js';
import TransactionHistoryModel from '../models/transaction_history.model.js';

import { GetOneUserBasedOnEmail } from '../utilities/user.utitlity.js';
import { GetEmailFromToken } from '../utilities/login.utility.js';
import { GenerateInvoiceNumber } from '../utilities/transaction.utility.js';

async function TopUpBalanceForUser({ top_up_amount = 0, token }) {
  if (top_up_amount < 0) {
    return {
      status: 102,
      message:
        'Parameter amount hanya boleh angka dan tidak boleh lebih kecil dari 0',
      data: null,
    };
  } else if (top_up_amount) {
    top_up_amount = +top_up_amount;
  }
  const emailFromToken = await GetEmailFromToken({ tokenData: token });

  if (!emailFromToken) {
    return null;
  }

  const user = await GetOneUserBasedOnEmail({ email: emailFromToken });

  if (!user) {
    return null;
  }

  const updatedBalance = (user?.balance || 0) + top_up_amount;

  await UserModel.updateOne(
    { _id: user._id },
    {
      $set: {
        balance: updatedBalance,
      },
    }
  );

  const invoiceCode = await GenerateInvoiceNumber();
  const dataTransactionHistory = {
    invoice_number: invoiceCode,
    transaction_type: 'TOPUP',
    total_amount: top_up_amount,
    user_id: user._id,
  };

  await TransactionHistoryModel.create(dataTransactionHistory);

  return {
    status: 0,
    message: 'Top Up Balance berhasil',
    data: {
      balance: updatedBalance,
    },
  };
}

export { TopUpBalanceForUser };
