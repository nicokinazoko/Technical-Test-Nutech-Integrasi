import TransactionHistoryModel from '../models/transaction_history.model.js';
import { GetOneUserBasedOnEmail } from '../utilities/user.utitlity.js';

/**
 * Retrieves all transaction histories for a specific user with optional pagination.
 *
 * This function constructs a query to fetch transaction histories from the `TransactionHistoryModel`
 * using the user's email to identify their transactions. It applies pagination if `offset` and `limit`
 * are provided, sorts the data by creation date (latest first), and populates service details.
 * The result includes formatted transaction records.
 *
 * @async
 * @function GetAllTransactionHistories
 * @param {Object} params - Parameters for fetching transaction histories.
 * @param {number} [params.offset=0] - The number of records to skip (default is 0).
 * @param {number|null} [params.limit=null] - The maximum number of records to fetch (optional).
 * @param {string} params.email - The email address of the user whose transaction histories are to be retrieved.
 * @returns {Promise<Object>} A promise that resolves to an object containing:
 *   - `status` {number} - A status code indicating success (0 for success).
 *   - `message` {string} - A message indicating the outcome (e.g., 'Get History Berhasil').
 *   - `data` {Object} - An object containing:
 *     - `offset` {number} - The offset used for pagination.
 *     - `limit` {number|null} - The limit used for pagination.
 *     - `records` {Array<Object>} - An array of transaction history records:
 *       - `invoice_number` {string} - The transaction's invoice number.
 *       - `transaction_type` {string} - The type of transaction.
 *       - `description` {string} - The service name or transaction description.
 *       - `total_amount` {number} - The total transaction amount.
 *       - `created_on` {Date|string} - The creation date of the transaction.
 *
 * @throws {Error} If the retrieval or processing of transaction histories fails, it throws an error.
 */
async function GetAllTransactionHistories({ offset = 0, limit = null, email }) {
  try {
    // declare match query active
    const queryMatch = [{ status: 'active' }];

    // get data user based on email to find user id
    const user = await GetOneUserBasedOnEmail({ email });

    // if email exists, then add user id in query match
    if (user?.email) {
      queryMatch.push({ user_id: user._id });
    }

    // define query to find with query match and sort latest data
    const query = TransactionHistoryModel.find({ $and: queryMatch }).sort({
      createdAt: -1,
    });

    // if limit not null, then add pagination
    if (limit != null) {
      query.skip(offset * limit).limit(limit);
    }

    // run query and populate the data
    const transactionHistories = await query
      .populate([{ path: 'service_id', select: 'service_name service_tariff' }])
      .lean();

    // map the return
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

    // return data
    return {
      status: 0,
      message: 'Get History Berhasil',
      data: {
        offset,
        limit,
        records,
      },
    };
  } catch (error) {
    console.log('Error GetAllTransactionHistories', error);
    throw new Error(error.message);
  }
}

export { GetAllTransactionHistories };
