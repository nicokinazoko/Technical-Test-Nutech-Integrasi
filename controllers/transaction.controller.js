import { GetOneUserBalanceBasedOnEmail } from '../services/user.service.js';

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

export { GetBalanceFromUserController };
