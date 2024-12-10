import UserModel from '../models/user.model.js';
import {
  CreateSalt,
  GenerateHashedPassword,
} from '../utilities/common.utility.js';

import { GetOneUserBasedOnEmail } from '../utilities/user.utitlity.js';
import { GetEmailFromToken } from '../utilities/login.utility.js';

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
    await UserModel.create(inputDataUser);

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

async function GetOneUserBasedOnToken({ token }) {
  const emailFromToken = await GetEmailFromToken({ tokenData: token });

  if (!emailFromToken) {
    return null;
  }

  const user = await GetOneUserBasedOnEmail({ email: emailFromToken });

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
}

async function GetOneUserBalanceBasedonToken({ token }) {
  const emailFromToken = await GetEmailFromToken({ tokenData: token });

  if (!emailFromToken) {
    return null;
  }

  const user = await GetOneUserBasedOnEmail({ email: emailFromToken });

  return {
    status: 0,
    message: 'Get Balance Berhasil',
    data: {
      balance: user?.balance || 0,
    },
  };
}

async function UpdateUserBasedOnToken({ token, first_name, last_name }) {
  const emailFromToken = await GetEmailFromToken({ tokenData: token });
  const updateData = {};

  if (!emailFromToken) {
    return null;
  }

  const user = await GetOneUserBasedOnEmail({ email: emailFromToken });

  if (!user) {
    return null;
  }

  if (first_name) {
    updateData.first_name = first_name;
  }

  if (last_name) {
    updateData.last_name = last_name;
  }

  const updatedUser = await UserModel.findByIdAndUpdate(
    user._id,
    {
      $set: updateData,
    },
    {
      new: true,
    }
  );

  return {
    status: 0,
    message: 'Update Pofile berhasil',
    data: {
      email: updatedUser?.email || '',
      first_name: user?.first_name || '',
      last_name: user?.last_name || '',
      profile_image: updatedUser?.profile_image,
    },
  };
}

export {
  CreateUser,
  GetOneUserBasedOnToken,
  GetOneUserBalanceBasedonToken,
  UpdateUserBasedOnToken,
};
