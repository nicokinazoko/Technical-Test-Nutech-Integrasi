import {
  CreateUser,
  GetOneProfileBasedOnEmail,
} from '../services/user.service.js';

import {
  ValidateEmail,
  ValidatePassword,
  ValidateRequiredInput,
} from '../utilities/common.utility.js';

import { CheckExistingUser } from '../utilities/user.utitlity.js';
import { Login } from '../services/login.service.js';

/**
 * Controller function to handle the registration of a new user for membership.
 *
 * This function validates the input data (email, first name, last name, and password), checks if the email is already
 * in use, and then calls the `CreateUser` function to create a new user in the database. If any validation fails,
 * an appropriate error message is returned. If user creation is successful, a success message is returned.
 *
 * @async
 * @function RegisterMembershipController
 * @param {Object} req - The request object containing the user's data in the body.
 * @param {Object} res - The response object used to send the API response.
 * @returns {Promise<void>} A promise that resolves when the response is sent.
 *
 * @throws {Error} If any of the validation steps or user creation fails, it will catch the error and send an appropriate
 * error response (400 for invalid input, 500 for other issues).
 */

async function RegisterMembershipController(req, res) {
  try {
    // get data from body
    const { email, first_name, last_name, password } = req.body;

    // section validate input
    await ValidateEmail({
      email,
    });

    await CheckExistingUser({ email });

    await ValidateRequiredInput({
      field_name: 'first_name',
      value: first_name,
    });

    await ValidateRequiredInput({
      field_name: 'last_name',
      value: last_name,
    });

    await ValidatePassword({
      password,
    });

    // end section validate input

    // call function to create user
    const resultCreateUser = await CreateUser({
      email,
      first_name,
      last_name,
      password,
    });

    return res.status(200).json(resultCreateUser);
  } catch (error) {
    // log the error
    console.error('Error in RegisterMembershipController:', error);

    if (error.status === 400) {
      // return error to api
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
 * Controller function to handle user login.
 *
 * This function validates the user's email and password from the request body,
 * and calls the `Login` function to authenticate the user. If validation or authentication fails,
 * an appropriate error message is returned. If login is successful, the login result is returned.
 *
 * @async
 * @function LoginController
 * @param {Object} req - The request object containing the user's email and password in the body.
 * @param {Object} res - The response object used to send the API response.
 * @returns {Promise<void>} A promise that resolves when the response is sent.
 *
 * @throws {Error} If any validation or login process fails, it will catch the error and send an appropriate
 * error response (401 for invalid credentials, 400 for invalid input, 500 for other issues).
 */

async function LoginController(req, res) {
  try {
    // get data email and password from body
    const { email, password } = req.body;

    // validate email
    await ValidateEmail({
      email,
    });

    // validate password
    await ValidatePassword({
      password,
    });

    const resultLogin = await Login({ email, password });

    // return respond from login
    res.status(200).json(resultLogin);
  } catch (error) {
    // log the error
    console.error('Error in LoginController:', error);

    if (error.status === 401) {
      return res.status(401).json({
        status: 401,
        message: 'Username atau password salah',
        data: null,
      });
    } else if (error.status === 400) {
      // return error to api
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
 * Controller function to handle retrieving a user's profile based on their email.
 *
 * This function extracts the user's email from the request (using the token data),
 * calls the `GetOneProfileBasedOnEmail` function to fetch the user's profile, 
 * and returns the result in the response. If an error occurs, it returns an appropriate error message.
 *
 * @async
 * @function GetOneProfileController
 * @param {Object} req - The request object containing the user's email from the token.
 * @param {Object} res - The response object used to send the API response.
 * @returns {Promise<void>} A promise that resolves when the response is sent.
 * 
 * @throws {Error} If the profile retrieval fails, it will send a 400 error for validation issues or a 500 error for other problems.
 */

async function GetOneProfileController(req, res) {
  try {
    // get email from req based on token
    const { email } = req.user;

    // call function get one profile with parameter email
    const resultProfile = await GetOneProfileBasedOnEmail({ email });

    // return result profile
    res.status(200).json(resultProfile);
  } catch (error) {
    if (error.status === 400) {
      // return error to api
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
  RegisterMembershipController,
  LoginController,
  GetOneProfileController,
};
