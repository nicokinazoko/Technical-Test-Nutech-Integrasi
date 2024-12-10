import { GenerateQueryMongoDB } from '../utilities/common.utility.js';
import {
  CreateSalt,
  GenerateHashedPassword,
  UploadSingleFile,
} from '../utilities/common.utility.js';

import { GetOneUserBasedOnEmail } from '../utilities/user.utitlity.js';

/**
 * Creates a new user in the system.
 *
 * This function takes user details, generates a salt and hashed password,
 * and saves the user information in the database. It ensures the email,
 * first name, and last name are trimmed and converted to lowercase before saving.
 * If successful, it returns a success message; otherwise, it logs and throws an error.
 *
 * @async
 * @function CreateUser
 * @param {Object} userDetails - An object containing user details.
 * @param {string} userDetails.email - The email address of the user.
 * @param {string} userDetails.first_name - The first name of the user.
 * @param {string} userDetails.last_name - The last name of the user.
 * @param {string} userDetails.password - The raw password of the user.
 * @returns {Promise<Object>} A promise that resolves to an object with the following properties:
 *   - `status` {number} - A status code indicating success (0 for success).
 *   - `message` {string} - A message indicating the outcome (e.g., registration success message).
 *   - `data` {null} - No data is returned for this function.
 *
 * @throws {Error} If there is an issue with the user creation process, it logs the error and throws an error with the message.
 */

async function CreateUser({ email, first_name, last_name, password }) {
  try {
    // generate salt for password
    const salt = await CreateSalt();

    // generate hashed password using salt
    const hashedPassword = await GenerateHashedPassword(password, salt);

    // define variable for create user
    const inputDataUser = {
      email: email ? email.trim().toLowerCase() : '',
      first_name: first_name ? first_name.trim().toLowerCase() : '',
      last_name: last_name ? last_name.trim().toLowerCase() : '',
      salt,
      hashed_password: hashedPassword,
    };

    // create data user
    await GenerateQueryMongoDB({
      collection_name: 'users',
      query: 'create',
      data: inputDataUser,
    });

    // return data user
    return {
      status: 0,
      message: 'Registrasi berhasil silahkan login',
      data: null,
    };
  } catch (error) {
    // log the error
    console.log(error);

    throw new Error(error.message);
  }
}

/**
 * Retrieves the profile information of a user based on their email.
 *
 * This function calls `GetOneUserBasedOnEmail` to fetch the user's data using the provided email,
 * and returns the user's email, first name, last name, and profile image. If any of the values are missing,
 * empty strings are returned instead. If an error occurs during the process, it logs the error and throws it.
 *
 * @async
 * @function GetOneProfileBasedOnEmail
 * @param {Object} emailDetails - An object containing the email to fetch the profile.
 * @param {string} emailDetails.email - The email address of the user whose profile is to be fetched.
 * @returns {Promise<Object>} A promise that resolves to an object containing:
 *   - `status` {number} - A status code indicating success (0 for success).
 *   - `message` {string} - A message indicating the outcome (e.g., 'Sukses').
 *   - `data` {Object} - An object containing the user's profile data:
 *     - `email` {string} - The user's email.
 *     - `first_name` {string} - The user's first name.
 *     - `last_name` {string} - The user's last name.
 *     - `profile_image` {string} - The user's profile image URL.
 *
 * @throws {Error} Throws an error if the profile retrieval fails.
 */

async function GetOneProfileBasedOnEmail({ email }) {
  try {
    const user = await GetOneUserBasedOnEmail({ email: email });

    return {
      status: 0,
      message: 'Sukses',
      data: {
        email: user?.email || '',
        first_name: user?.first_name || '',
        last_name: user?.last_name || '',
        profile_image: user?.profile_image || '',
      },
    };
  } catch (error) {
    // log the error
    console.log(error);

    throw new Error(error.message);
  }
}

/**
 * Retrieves the balance of a user based on their email.
 *
 * This function fetches the user's data using the `GetOneUserBasedOnEmail` function
 * and returns the user's balance. If the user is not found or their balance is missing,
 * the balance defaults to 0.
 *
 * @async
 * @function GetOneUserBalanceBasedOnEmail
 * @param {Object} userDetails - An object containing the email of the user.
 * @param {string} userDetails.email - The email address of the user whose balance is to be retrieved.
 * @returns {Promise<Object>} A promise that resolves to an object containing:
 *   - `status` {number} - A status code indicating success (0 for success).
 *   - `message` {string} - A message indicating the outcome (e.g., 'Get Balance Berhasil').
 *   - `data` {Object} - An object containing the user's balance:
 *     - `balance` {number} - The user's balance (defaults to 0 if not found).
 *
 * @throws {Error} If there is an issue retrieving the user's data or balance, it will throw an error.
 */

async function GetOneUserBalanceBasedOnEmail({ email }) {
  // call function to get user based on email
  const user = await GetOneUserBasedOnEmail({ email });

  // return balance user
  return {
    status: 0,
    message: 'Get Balance Berhasil',
    data: {
      balance: user?.balance || 0,
    },
  };
}

/**
 * Updates a user's profile based on their email.
 *
 * This function retrieves the user by email using `GetOneUserBasedOnEmail`,
 * then updates the user's first name and/or last name if provided in the input.
 * It calls the `UserModel.findByIdAndUpdate` method to apply the changes to the user's record
 * and returns the updated user profile data. If an error occurs during the process,
 * it logs the error and throws it.
 *
 * @async
 * @function UpdateUserBasedEmail
 * @param {Object} userDetails - An object containing the user's details.
 * @param {string} userDetails.email - The email of the user to update.
 * @param {string} [userDetails.first_name] - The new first name of the user (optional).
 * @param {string} [userDetails.last_name] - The new last name of the user (optional).
 * @returns {Promise<Object>} A promise that resolves to an object containing:
 *   - `status` {number} - A status code indicating success (0 for success).
 *   - `message` {string} - A message indicating the outcome (e.g., 'Update Profile berhasil').
 *   - `data` {Object} - An object containing the updated user profile data:
 *     - `email` {string} - The user's email.
 *     - `first_name` {string} - The user's first name.
 *     - `last_name` {string} - The user's last name.
 *     - `profile_image` {string} - The user's profile image URL.
 *
 * @throws {Error} Throws an error if the profile update fails or if the user is not found.
 */

async function UpdateUserBasedEmail({ email, first_name, last_name }) {
  try {
    const updateData = {};

    const user = await GetOneUserBasedOnEmail({ email: email });

    if (first_name) {
      updateData.first_name = first_name;
    }

    if (last_name) {
      updateData.last_name = last_name;
    }

    const parameterQuery = { _id: user._id };
    const updatedUser = await GenerateQueryMongoDB({
      collection_name: 'users',
      query: 'findByIdAndUpdate',
      parameter: parameterQuery,
      data: updateData,
    });

    return {
      status: 0,
      message: 'Update Pofile berhasil',
      data: {
        email: updatedUser?.email || '',
        first_name: updatedUser?.first_name || '',
        last_name: updatedUser?.last_name || '',
        profile_image: updatedUser?.profile_image,
      },
    };
  } catch (error) {
    // log the error
    console.log(error);

    throw new Error(error.message);
  }
}

/**
 * Update the profile image of a user based on their email.
 *
 * This function first finds the user by email, uploads a profile image to Cloudinary,
 * and then updates the user's profile with the new image URL.
 *
 * @async
 * @function UpdateProfileUserBasedOnEmail
 * @param {Object} params - The parameters for updating the user's profile.
 * @param {string} params.email - The email of the user whose profile is to be updated.
 * @param {Object} params.file - The image file to upload.
 * @returns {Object} The response object containing the update status and user data.
 *
 * @throws {Error} Throws an error if:
 * - The user is not found.
 * - Any other error occurs during the file upload or profile update process.
 */
async function UpdateProfileUserBasedOnEmail({ email, file }) {
  try {
    const user = await GetOneUserBasedOnEmail({ email: email });

    // Upload to Cloudinary
    const uploadResult = await UploadSingleFile({ file });

    // const updateProfileUser = await UserModel.findByIdAndUpdate(user._id, {
    //   $set: {
    //     profile_image: uploadResult?.secure_url,
    //   },
    // });
    const updateData = { profile_image: uploadResult?.secure_url };
    const parameterQuery = { _id: user._id };
    const updateProfileUser = await GenerateQueryMongoDB({
      collection_name: 'users',
      query: 'findByIdAndUpdate',
      parameter: parameterQuery,
      data: updateData,
    });

    return {
      status: 0,
      message: 'Update Profile Image berhasil',
      data: {
        email: updateProfileUser?.email || '',
        first_name: updateProfileUser.first_name || '',
        last_name: updateProfileUser?.last_name || '',
        profile_image: uploadResult?.secure_url,
      },
    };
  } catch (error) {
    // log the error
    console.log(error);

    throw new Error(error.message);
  }
}

export {
  CreateUser,
  GetOneUserBalanceBasedOnEmail,
  GetOneProfileBasedOnEmail,
  UpdateUserBasedEmail,
  UpdateProfileUserBasedOnEmail,
};
