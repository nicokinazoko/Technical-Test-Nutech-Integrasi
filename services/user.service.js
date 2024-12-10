import { GenerateQueryMongoDB } from '../utilities/common.utility.js';
import {
  CreateSalt,
  GenerateHashedPassword,
  UploadSingleFile,
} from '../utilities/common.utility.js';

import { GetOneUserBasedOnEmail } from '../utilities/user.utitlity.js';

/**
 * Create a new user in the system by registering their details.
 *
 * This function handles the user registration process by accepting the user's email, first name,
 * last name, and password. It generates a salt and hashes the password before storing the user's
 * details in the database. The function returns a success message upon successful registration.
 *
 * @async
 * @function
 *
 * @param {Object} params - The function parameters.
 * @param {string} params.email - The user's email address, which is used for identification.
 * @param {string} params.first_name - The user's first name.
 * @param {string} params.last_name - The user's last name.
 * @param {string} params.password - The user's password.
 *
 * @returns {Promise<Object>} A promise that resolves to an object containing the status, message,
 * and data (which will be null for successful registration).
 *
 * @throws {Error} Throws an error if any validation fails or if the registration process encounters
 * an issue (e.g., duplicate email, database error).
 *
 * @example
 * const result = await CreateUser({
 *   email: 'user@example.com',
 *   first_name: 'John',
 *   last_name: 'Doe',
 *   password: 'password123',
 * });
 * console.log(result);
 * // Example response:
 * // {
 * //   status: 0,
 * //   message: 'Registrasi berhasil silahkan login',
 * //   data: null,
 * // }
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
 * Fetch a user's profile based on their email address.
 *
 * This function retrieves the user's profile information from the database using their email.
 * It returns the user's email, first name, last name, and profile image URL.
 *
 * @async
 * @function
 *
 * @param {Object} params - The function parameters.
 * @param {string} params.email - The email address of the user whose profile is to be retrieved.
 *
 * @returns {Promise<Object>} A promise that resolves to an object containing the user's profile
 * details (email, first name, last name, and profile image).
 *
 * @throws {Error} Throws an error if the user is not found or any other issue occurs during the
 * process of retrieving the user profile.
 *
 * @example
 * const result = await GetOneProfileBasedOnEmail({ email: 'user@example.com' });
 * console.log(result);
 * // Example response:
 * // {
 * //   status: 0,
 * //   message: 'Sukses',
 * //   data: {
 * //     email: 'user@example.com',
 * //     first_name: 'John',
 * //     last_name: 'Doe',
 * //     profile_image: 'https://cloudinary.url/profile_image.jpg',
 * //   }
 * // }
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
 * Retrieve the balance of a user based on their email address.
 *
 * This function fetches the user's balance from the database using their email. It returns the user's
 * balance, or 0 if the balance is not found.
 *
 * @async
 * @function
 *
 * @param {Object} params - The function parameters.
 * @param {string} params.email - The email address of the user whose balance is to be retrieved.
 *
 * @returns {Promise<Object>} A promise that resolves to an object containing the user's balance.
 *
 * @throws {Error} Throws an error if the user is not found or any other issue occurs during the
 * process of retrieving the balance.
 *
 * @example
 * const result = await GetOneUserBalanceBasedOnEmail({ email: 'user@example.com' });
 * console.log(result);
 * // Example response:
 * // {
 * //   status: 0,
 * //   message: 'Get Balance Berhasil',
 * //   data: {
 * //     balance: 1000,
 * //   }
 * // }
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
 * Update the user's profile information based on their email.
 *
 * This function updates the user's first name and last name in the database. It uses the email to
 * identify the user and only updates the fields that are provided in the input.
 *
 * @async
 * @function
 *
 * @param {Object} params - The function parameters.
 * @param {string} params.email - The email address of the user to be updated.
 * @param {string} [params.first_name] - The new first name of the user (optional).
 * @param {string} [params.last_name] - The new last name of the user (optional).
 *
 * @returns {Promise<Object>} A promise that resolves to an object containing the updated user data.
 *
 * @throws {Error} Throws an error if the user is not found or if there is an issue with updating the user.
 *
 * @example
 * const result = await UpdateUserBasedEmail({
 *   email: 'user@example.com',
 *   first_name: 'John',
 *   last_name: 'Doe',
 * });
 * console.log(result);
 * // Example response:
 * // {
 * //   status: 0,
 * //   message: 'Update Pofile berhasil',
 * //   data: {
 * //     email: 'user@example.com',
 * //     first_name: 'John',
 * //     last_name: 'Doe',
 * //     profile_image: 'https://example.com/profile.jpg',
 * //   }
 * // }
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
 * Update the profile image of a user based on their email address.
 *
 * This function updates the user's profile image in the database. It uses the provided email to
 * find the user, uploads the new profile image to Cloudinary, and updates the user's profile with
 * the new image URL. The updated user profile data is returned in the response.
 *
 * @async
 * @function
 *
 * @param {Object} params - The function parameters.
 * @param {string} params.email - The email address of the user whose profile image will be updated.
 * @param {Object} params.file - The file object containing the new profile image to be uploaded.
 *
 * @returns {Promise<Object>} A promise that resolves to an object containing the updated user profile.
 *
 * @throws {Error} Throws an error if the user is not found, the upload fails, or there is an issue with the update.
 *
 * @example
 * const result = await UpdateProfileUserBasedOnEmail({
 *   email: 'user@example.com',
 *   file: <uploaded file>,
 * });
 * console.log(result);
 * // Example response:
 * // {
 * //   status: 0,
 * //   message: 'Update Profile Image berhasil',
 * //   data: {
 * //     email: 'user@example.com',
 * //     first_name: 'John',
 * //     last_name: 'Doe',
 * //     profile_image: 'https://cloudinary.com/profile_image.jpg',
 * //   }
 * // }
 */

async function UpdateProfileUserBasedOnEmail({ email, file }) {
  try {
    const user = await GetOneUserBasedOnEmail({ email: email });

    // Upload to Cloudinary
    const uploadResult = await UploadSingleFile({ file });

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
