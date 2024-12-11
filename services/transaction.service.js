import { GenerateQueryMongoDB } from '../utilities/common.utility.js';

import { GetOneUserBasedOnEmail } from '../utilities/user.utitlity.js';
import { GenerateInvoiceNumber } from '../utilities/transaction.utility.js';
import { GetOneServiceBasedOnServiceCode } from '../utilities/service.utility.js';

/**
 * Top up the balance for a user.
 *
 * This function handles the process of topping up a user's balance. It validates the top-up amount,
 * retrieves the user data based on the provided email, and updates the user's balance. It also
 * creates a transaction history record for the top-up.
 *
 * @async
 * @function
 *
 * @param {Object} params - The function parameters.
 * @param {number} params.top_up_amount - The amount to top up the user's balance.
 * @param {string} params.email - The user's email address used to identify the user.
 *
 * @returns {Promise<Object>} A promise that resolves to an object containing the status, message, and the updated user balance.
 *
 * @throws {Error} Throws an error if any validation fails, the user is not found, or the update fails.
 *
 * @example
 * const result = await TopUpBalanceForUser({
 *   top_up_amount: 50000,
 *   email: 'user@example.com',
 * });
 * console.log(result);
 * // Example response:
 * // {
 * //   status: 0,
 * //   message: 'Top Up Balance berhasil',
 * //   data: {
 * //     balance: 100000,
 * //   }
 * // }
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

    const parameterUpdate = { _id: user._id };
    const updatedData = { balance: updatedBalance };
    await GenerateQueryMongoDB({
      collection_name: 'users',
      query: 'update',
      parameter: parameterUpdate,
      data: updatedData,
    });

    // generate invoice code
    const invoiceCode = await GenerateInvoiceNumber();

    // prepare data for create transaction history for topup
    const dataTransactionHistory = {
      invoice_number: invoiceCode,
      transaction_type: 'TOPUP',
      total_amount: top_up_amount,
      user_id: user._id,
      status: 'active',
    };

    // create transaction history for topup
    await GenerateQueryMongoDB({
      collection_name: 'transaction_histories',
      query: 'create',
      data: dataTransactionHistory,
    });

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
 * Create a transaction for a user by processing a payment.
 *
 * This function handles the creation of a transaction for a user. It checks the user's balance,
 * retrieves the corresponding service based on the service code, and processes the payment if the
 * balance is sufficient. It also updates the user's balance and creates a transaction history record.
 *
 * @async
 * @function
 *
 * @param {Object} params - The function parameters.
 * @param {string} params.service_code - The code of the service the user is paying for.
 * @param {string} params.email - The user's email address used to identify the user.
 *
 * @returns {Promise<Object>} A promise that resolves to an object containing the status, message,
 * and the details of the created transaction.
 *
 * @throws {Error} Throws an error if any validation fails, the user is not found, the service does
 * not exist, or the user has insufficient balance.
 *
 * @example
 * const result = await CreateTransaction({
 *   service_code: 'SERVICE123',
 *   email: 'user@example.com',
 * });
 * console.log(result);
 * // Example response:
 * // {
 * //   status: 0,
 * //   message: 'Transaksi berhasil',
 * //   data: {
 * //     invoice_number: 'INV12345',
 * //     service_code: 'SERVICE123',
 * //     service_name: 'Premium Service',
 * //     transaction_type: 'PAYMENT',
 * //     total_amount: 5000,
 * //     created_on: '2024-12-10T00:00:00Z',
 * //   }
 * // }
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

  const parameterUpdate = { _id: user._id };
  const updatedData = { balance: updatedBalance };

  // update balance in user
  await GenerateQueryMongoDB({
    collection_name: 'users',
    query: 'update',
    parameter: parameterUpdate,
    data: updatedData,
  });

  // generate invoice code
  const invoiceCode = await GenerateInvoiceNumber();

  const dateCreated = new Date();
  // define data for create history transaction
  const dataTransactionHistory = {
    invoice_number: invoiceCode,
    transaction_type: 'PAYMENT',
    total_amount: service.service_tariff,
    user_id: user._id,
    service_id: service._id,
    createdAt: dateCreated,
    status: 'active',
  };

  // create data transaction history
  await GenerateQueryMongoDB({
    collection_name: 'transaction_histories',
    query: 'create',
    data: dataTransactionHistory,
  });

  // return transaction data
  return {
    status: 0,
    message: 'Transaksi berhasil',
    data: {
      invoice_number: dataTransactionHistory?.invoice_number || '',
      service_code: service?.service_code || '',
      service_name: service?.service_name || '',
      transaction_type: dataTransactionHistory?.transaction_type || '',
      total_amount: dataTransactionHistory.total_amount || 0,
      created_on: dataTransactionHistory?.createdAt || '',
    },
  };
}

export { TopUpBalanceForUser, CreateTransaction };
