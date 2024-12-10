import UserModel from '../models/user.model.js';
import TransactionHistoryModel from '../models/transaction_history.model.js';

import { GetOneUserBasedOnEmail } from '../utilities/user.utitlity.js';
import { GetEmailFromToken } from '../utilities/login.utility.js';
import { GenerateInvoiceNumber } from '../utilities/transaction.utility.js';
import { GetOneServiceBasedOnServiceCode } from '../utilities/service.utility.js';

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

async function CreateTransaction({ service_code, token }) {
  const emailFromToken = await GetEmailFromToken({ tokenData: token });

  if (!emailFromToken) return null;

  const user = await GetOneUserBasedOnEmail({ email: emailFromToken });

  if (!user) return null;

  const service = await GetOneServiceBasedOnServiceCode({ service_code });

  if (!service) return null;

  if (!user?.balance || user.balance < service.service_tariff) {
    throw new Error('Balance tidak cukup');
  }

  const updatedBalance = (user?.balance || 0) - service.service_tariff;

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
    transaction_type: 'PAYMENT',
    total_amount: service.service_tariff,
    user_id: user._id,
    service_id: service._id,
  };

  const transactionHistory = await TransactionHistoryModel.create(
    dataTransactionHistory
  );

  return {
    status: 0,
    message: 'Transaksi berhasil',
    data: {
      invoice_number: transactionHistory?.invoice_number || '',
      service_code: service?.service_code || '',
      service_name: service?.service_name || '',
      transaction_type: transactionHistory?.transaction_type || '',
      total_amount: transactionHistory.total_amount || 0,
      created_on: transactionHistory?.createdAt || '',
    },
  };
}

export { TopUpBalanceForUser, CreateTransaction };
