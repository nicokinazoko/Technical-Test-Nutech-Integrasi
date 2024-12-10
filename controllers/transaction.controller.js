import { GetOneUserBalanceBasedOnEmail } from '../services/user.service.js';
import { GetAllTransactionHistories } from '../services/transaction_history.service.js';
import {
  TopUpBalanceForUser,
  CreateTransaction,
} from '../services/transaction.service.js';

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

/**
 * Controller function to handle top-up balance requests for a user.
 *
 * This function extracts the top-up amount from the request body and the user's email
 * from the middleware. It calls the `TopUpBalanceForUser` function to process the balance
 * update and returns the result. If an error occurs, an appropriate error message is sent.
 *
 * @async
 * @function TopUpBalanceForUserController
 * @param {Object} req - The request object containing:
 *   - `body` {Object} - The request body with the `top_up_amount` parameter.
 *   - `user` {Object} - The user object injected by middleware, containing the user's email.
 * @param {Object} res - The response object used to send the API response.
 * @returns {Promise<void>} A promise that resolves when the response is sent.
 *
 * @throws {Error} If the top-up process fails:
 *   - Sends a 400 status response for client-side errors (e.g., invalid input).
 *   - Sends a 500 status response for server-side errors.
 */

async function TopUpBalanceForUserController(req, res) {
  try {
    // get data top up amount from body
    const { top_up_amount } = req.body;

    // get data email from user
    const { email } = req.user;

    // call function to calculate balance for top up
    const resultTopUpBalance = await TopUpBalanceForUser({
      email,
      top_up_amount,
    });

    // return response
    res.status(200).json(resultTopUpBalance);
  } catch (error) {
    // log the error
    console.error('Error in TopUpBalanceForUserController:', error);

    // return error to api
    if (error.status === 400) {
      res.status(400).json({
        status: 102,
        message: error.message,
        data: null,
      });
    } else {
      // return error to api
      res.status(500).json({
        status: 102,
        message: error.message,
        data: null,
      });
    }
  }
}

/**
 * Controller to handle transaction creation for a user.
 *
 * This function processes a request to create a transaction for a specific service.
 * It retrieves the user's email from the authentication middleware and the service code
 * from the request body, then calls the `CreateTransaction` function to perform the operation.
 *
 * @async
 * @function CreateTransactionForUserController
 * @param {Object} req - The request object from the client.
 * @param {Object} req.user - The user object populated by middleware, containing the user's email.
 * @param {string} req.user.email - The email of the authenticated user.
 * @param {Object} req.body - The body of the HTTP request.
 * @param {string} req.body.service_code - The unique service code for the transaction.
 * @param {Object} res - The response object to send the results.
 * @returns {void} Sends an HTTP response containing the result of the transaction creation or an error message.
 *
 * @example
 * // Example request body
 * // POST /create-transaction
 * {
 *   "service_code": "SVC123"
 * }
 *
 * @throws {Error} Returns an HTTP 400 status with an error message for client-side errors,
 * or a 500 status for server-side errors.
 */

async function CreateTransactionForUserController(req, res) {
  try {
    const { email } = req.user;
    const { service_code } = req.body;
    const resultCreateTransaction = await CreateTransaction({
      service_code,
      email,
    });

    res.status(200).json(resultCreateTransaction);
  } catch (error) {
    // log the error
    console.error('Error in CreateTransactionForUserController:', error);

    // return error to api
    if (error.status === 400) {
      res.status(400).json({
        status: 102,
        message: error.message,
        data: null,
      });
    } else {
      // return error to api
      res.status(500).json({
        status: 102,
        message: error.message,
        data: null,
      });
    }
  }
}

export {
  GetBalanceFromUserController,
  GetTransactionHistoriesContrroller,
  TopUpBalanceForUserController,
  CreateTransactionForUserController,
};
