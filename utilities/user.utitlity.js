import { GenerateQueryMongoDB } from '../utilities/common.utility.js';

/**
 * Check if a user already exists based on the provided email.
 *
 * This function checks the 'users' collection in the database to verify if a user already exists
 * with the given email. If a user is found, it throws an error indicating the email is already registered.
 * If no user is found, it returns null, indicating that the email is available for registration.
 *
 * @async
 * @function
 *
 * @param {Object} params - The function parameters.
 * @param {string} params.email - The email address to check for existence.
 *
 * @throws {Error} Throws an error if the email is already registered.
 *
 * @returns {Promise<Object|null>} A promise that resolves to the user object if found, or null if not found.
 *
 * @example
 * try {
 *   const existingUser = await CheckExistingUser({ email: 'user@example.com' });
 *   console.log(existingUser);
 * } catch (error) {
 *   console.error(error.message);
 * }
 * // Example response when email is already registered:
 * // Error: 'Email sudah terdaftar, silahkan input email yang lain'
 *
 * // If the email is available:
 * // null
 */

async function CheckExistingUser({ email }) {
  if (!email) throw new Error('parameter email is required');

  const parameterQuery = { email: email.trim() };

  const queryBuilder = GenerateQueryMongoDB({
    collection_name: 'users',
    query: 'findOne',
    parameter: parameterQuery,
  });

  const checkExistingUser = await queryBuilder;

  if (checkExistingUser) {
    const error = new Error(
      'Email sudah terdaftar, silahkan input email yang lain'
    );
    error.status = 400;
    throw error;
  }

  return checkExistingUser;
}

/**
 * Retrieve a user from the database based on their email.
 *
 * This function queries the 'users' collection in the database to find a user that matches the provided
 * email. If the email is missing or invalid, an error is thrown. The function returns the user object if
 * found, or null if no user is found with that email.
 *
 * @async
 * @function
 *
 * @param {Object} params - The function parameters.
 * @param {string} params.email - The email of the user to retrieve.
 *
 * @throws {Error} Throws an error if the email is not provided.
 *
 * @returns {Promise<Object|null>} A promise that resolves to the user object if found, or null if not found.
 *
 * @example
 * try {
 *   const user = await GetOneUserBasedOnEmail({ email: 'user@example.com' });
 *   console.log(user);
 * } catch (error) {
 *   console.error(error.message);
 * }
 * // Example response when email is provided and user is found:
 * // {
 * //   _id: 'user_id',
 * //   email: 'user@example.com',
 * //   first_name: 'John',
 * //   last_name: 'Doe',
 * //   profile_image: 'https://some-image-url.com'
 * // }
 *
 * // If email is missing or invalid, it throws:
 * // Error: 'Email is required'
 */

async function GetOneUserBasedOnEmail({ email }) {
  if (!email) {
    throw new Error('Email is required');
  }
  const parameterQuery = { email: email.trim() };

  const queryBuilder = GenerateQueryMongoDB({
    collection_name: 'users',
    query: 'findOne',
    parameter: parameterQuery,
  });

  const user = await queryBuilder;
  // const user = await UserModel.findOne({ email }).lean();

  return user;
}

export { CheckExistingUser, GetOneUserBasedOnEmail };
