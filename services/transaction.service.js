import UserModel from '../models/user.model.js';
import TransactionHistoryModel from '../models/transaction_history.model.js';

import { GetOneUserBasedOnEmail } from '../utilities/user.utitlity.js';
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

/**
 * Create a transaction for a user based on a service code.
 *
 * This function verifies the user's existence, retrieves the requested service, checks for sufficient balance,
 * deducts the service tariff from the user's balance, and logs the transaction in the history.
 *
 * @async
 * @function CreateTransaction
 * @param {Object} params - The parameters for the transaction.
 * @param {string} params.service_code - The unique code for the requested service.
 * @param {string} params.email - The email of the user initiating the transaction.
 * @returns {Object} An object containing the transaction details and updated balance.
 *
 * @throws {Error} Throws an error if:
 * - The user is not found (status 400).
 * - The service is not found (status 400).
 * - The user's balance is insufficient (status 400).
 */

async function CreateTransaction({ service_code, email }) {
  // find user based on email from parameter
  const user = await GetOneUserBasedOnEmail({ email: email });

  // if user not found, then throw error
  if (!user) {
    const error = new Error('User not found');
    error.status = 400;
    throw error;
  }

  // call function to get service based on service code
  const service = await GetOneServiceBasedOnServiceCode({ service_code });

  // if service not found, then throw error
  if (!service) {
    const error = new Error('Service atau Layanan tidak ditemukan');
    error.status = 400;
    throw error;
  }

  // if balance is sufficient, then throw error
  if (!user?.balance || user.balance < service.service_tariff) {
    const error = new Error('Balance tidak cukup');
    error.status = 400;
    throw error;
  }

  // calculate updated balance
  const updatedBalance = (user?.balance || 0) - service.service_tariff;

  // update balance in user
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

  // define data for create history transaction
  const dataTransactionHistory = {
    invoice_number: invoiceCode,
    transaction_type: 'PAYMENT',
    total_amount: service.service_tariff,
    user_id: user._id,
    service_id: service._id,
  };

  // create data transaction history
  const transactionHistory = await TransactionHistoryModel.create(
    dataTransactionHistory
  );

  // return transaction data
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
