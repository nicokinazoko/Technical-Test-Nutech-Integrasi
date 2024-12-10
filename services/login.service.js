import { ComparePassword, GetToken } from '../utilities/login.utility.js';

import { GetOneUserBasedOnEmail } from '../utilities/user.utitlity.js';

/**
 * Handles the user login process.
 *
 * This function is responsible for authenticating the user. It checks if the user exists based on the provided email,
 * compares the password with the stored hash, and generates a token for successful authentication.
 *
 * @async
 * @function
 *
 * @param {Object} params - The input parameters for the login process.
 * @param {string} params.email - The user's email address for authentication.
 * @param {string} params.password - The password input by the user for authentication.
 *
 * @returns {Object} Returns an object containing the status, message, and a JWT token on successful login.
 *
 * @throws {Error} Throws an error if the user is not found, the password is incorrect, or any other login issues occur.
 *
 * @example
 * // Request:
 * // POST /login
 * // Request body: { email: 'user@example.com', password: 'password123' }
 *
 * // Success response:
 * {
 *   status: 0,
 *   message: 'Login Sukses',
 *   data: {
 *     token: 'generated_jwt_token',
 *   }
 * }
 *
 * // Error response:
 * {
 *   status: 401,
 *   message: 'Username atau password salah',
 *   data: null
 * }
 */

async function Login({ email, password }) {
  // find user based on email
  const user = await GetOneUserBasedOnEmail({ email });

  // if user not found, then  throw error
  if (!user || (user && !user.email)) throw new Error('User is not exist');

  // compare password from user and input
  const passwordMatch = await ComparePassword({
    password_input: password,
    user,
  });

  // if password doesn't match, then throw error
  if (!passwordMatch) {
    const error = new Error('Username atau password salah');
    error.status = 401;
    throw error;
  }

  // set token data
  const tokenData = {
    email: user.email,
  };

  //  get token data
  const token = await GetToken({ tokenData, timeExpired: '12h' });


  // return token
  return {
    status: 0,
    message: 'Login Sukses',
    data: {
      token,
    },
  };
}

export { Login };
