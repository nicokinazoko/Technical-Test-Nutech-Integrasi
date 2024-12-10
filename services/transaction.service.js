import UserModel from '../models/user.model.js';
import TransactionHistoryModel from '../models/transaction_history.model.js';

import { GetOneUserBasedOnEmail } from '../utilities/user.utitlity.js';
import { GetEmailFromToken } from '../utilities/login.utility.js';
import { GenerateInvoiceNumber } from '../utilities/transaction.utility.js';
import { GetOneServiceBasedOnServiceCode } from '../utilities/service.utility.js';

/**
 * Function to handle top-up balance for a user.
 *
 * This function validates the top-up amount, retrieves the user based on the provided email, 
 * updates the user's balance, generates a transaction history, and returns the updated balance.
 *
 * @async
 * @function TopUpBalanceForUser
 * @param {Object} params - Parameters required for the top-up process.
 * @param {number} params.top_up_amount - The amount to be added to the user's balance. 
 *   Must be a positive number.
 * @param {string} params.email - The email address of the user whose balance will be updated.
 * @returns {Promise<Object>} A promise that resolves to an object containing:
 *   - `status` {number} - Status code (0 for success).
 *   - `message` {string} - Success message ('Top Up Balance berhasil').
 *   - `data` {Object} - An object containing:
 *     - `balance` {number} - The updated balance of the user.
 * 
 * @throws {Error} If an error occurs during the process:
 *   - Throws a 400 error if the top-up amount is invalid or the user does not exist.
 *   - Logs the error and rethrows it for handling by higher-level functions.
 */

async function TopUpBalanceForUser({ top_up_amount, email }) {
  try {
    // if top up amount is 0 and not number
    if (top_up_amount <= 0 || typeof top_up_amount !== 'number') {
      // throw error
      const error = new Error(
        'Parameter amount hanya boleh angka dan tidak boleh lebih kecil dari 0'
      );
      error.status = 400;
      throw error;
    }

    // get data user based on email from parameter
    const user = await GetOneUserBasedOnEmail({ email: email });

    // if user not found, then throw error
    if (!user) {
      const error = new Error('User not found');
      error.status = 400;
      throw error;
    }

    // calculate balance for user
    const updatedBalance = (user?.balance || 0) + top_up_amount;

    // update balance user
    await UserModel.updateOne(
      { _id: user._id },
      {
        $set: {
          balance: updatedBalance,
        },
      }
    );

    // generate invoice code
    const invoiceCode = await GenerateInvoiceNumber();

    // prepare data for create transaction history for topup
    const dataTransactionHistory = {
      invoice_number: invoiceCode,
      transaction_type: 'TOPUP',
      total_amount: top_up_amount,
      user_id: user._id,
    };

    // create transaction history for topup
    await TransactionHistoryModel.create(dataTransactionHistory);

    // return data
    return {
      status: 0,
      message: 'Top Up Balance berhasil',
      data: {
        balance: updatedBalance,
      },
    };
  } catch (error) {
    // log the error
    console.log(error);

    throw new Error(error.message);
  }
}

async function CreateTransaction({ service_code, token }) {
  const emailFromToken = await GetEmailFromToken({ tokenData: token });

  if (!emailFromToken) return null;

  const user = await GetOneUserBasedOnEmail({ email: emailFromToken });

  if (!user) return null;

  const service = await GetOneServiceBasedOnServiceCode({ service_code });

  if (!service) return null;

  if (!user?.balance || user.balance < service.service_tariff) {
    const error = new Error('Balance tidak cukup');
    error.status = 400;
    throw error;
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
