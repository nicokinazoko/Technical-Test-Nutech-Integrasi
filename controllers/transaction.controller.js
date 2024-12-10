import { GetOneUserBalanceBasedOnEmail } from '../services/user.service.js';
import { GetAllTransactionHistories } from '../services/transaction_history.service.js';

/**
 * Controller function to retrieve a user's balance.
 *
 * This function extracts the user's email from the request (provided by middleware),
 * calls the `GetOneUserBalanceBasedOnEmail` function to fetch the user's balance,
 * and returns the balance data in the response. If an error occurs, an appropriate error message is sent.
 *
 * @async
 * @function GetBalanceFromUserController
 * @param {Object} req - The request object containing the user's email from the token.
 * @param {Object} res - The response object used to send the API response.
 * @returns {Promise<void>} A promise that resolves when the response is sent.
 *
 * @throws {Error} If the balance retrieval fails, it will send a 500 error response with the error message.
 */

async function GetBalanceFromUserController(req, res) {
  try {
    // get email from middleware
    const { email } = req.user;

    // call function to get data balance based on email
    const resulstGetBalance = await GetOneUserBalanceBasedOnEmail({ email });

    // return data balance
    res.status(200).json(resulstGetBalance);
  } catch (error) {
    // log the error
    console.error('Error in GetAllBannersController:', error);

    // return error to api
    res.status(500).json({
      status: 102,
      message: error.message,
      data: null,
    });
  }
}

/**
 * Controller function to retrieve a user's transaction histories.
 *
 * This function extracts the offset and limit values from the request query parameters,
 * and the user's email from the middleware. It calls the `GetAllTransactionHistories` function
 * to fetch the transaction histories based on the provided email, offset, and limit.
 * The results are returned in the response. If an error occurs, an appropriate error message is sent.
 *
 * @async
 * @function GetTransactionHistoriesContrroller
 * @param {Object} req - The request object containing query parameters (offset, limit) and the user's email from middleware.
 * @param {Object} res - The response object used to send the API response.
 * @returns {Promise<void>} A promise that resolves when the response is sent.
 *
 * @throws {Error} If the retrieval of transaction histories fails, it will send a 500 error response with the error message.
 */

async function GetTransactionHistoriesContrroller(req, res) {
  try {
    // get data offset and limit from query
    const { offset, limit } = req.query;

    // get data email from middleware
    const { email } = req.user;

    // call function to get data transaction histories
    const resultTransactionHistories = await GetAllTransactionHistories({
      offset,
      limit,
      email,
    });

    // return result find transaction histories
    res.status(200).json(resultTransactionHistories);
  } catch (error) {
    // log the error
    console.error('Error in GetAllBannersController:', error);

    // return error to api
    res.status(500).json({
      status: 102,
      message: error.message,
      data: null,
    });
  }
}

export { GetBalanceFromUserController, GetTransactionHistoriesContrroller };
