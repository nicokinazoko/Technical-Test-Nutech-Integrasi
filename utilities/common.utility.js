import bcrypt from 'bcrypt';
import cloudinary from 'cloudinary';
import fs from 'fs';

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const saltRounds = 10;

/**
 * Generates a salt for password hashing.
 *
 * This function uses bcrypt to generate a secure salt based on the defined salt rounds.
 *
 * @async
 * @function CreateSalt
 * @returns {Promise<string>} A promise that resolves to the generated salt.
 */
async function CreateSalt() {
  // generate salt using bycrypt and with salt rounds based on declaration
  const salt = await bcrypt.genSalt(saltRounds);

  // return salt
  return salt;
}

/**
 * Generates a hashed password using the provided password and salt.
 *
 * This function concatenates the password with the salt and hashes it using bcrypt.
 *
 * @async
 * @function GenerateHashedPassword
 * @param {string} password - The raw password to hash.
 * @param {string} salt - The salt to use for hashing.
 * @returns {Promise<string>} A promise that resolves to the hashed password.
 */

async function GenerateHashedPassword(password, salt) {
  // generate hash password using password and salt with salt rounds based on declaration
  let hashedPassword = await bcrypt.hash(password + salt, saltRounds);

  // return hashed password
  return hashedPassword;
}

/**
 * Validates the format of an email address.
 *
 * This function checks if the provided email matches a valid email format.
 * Throws an error if the format is invalid.
 *
 * @async
 * @function ValidateEmail
 * @param {Object} emailDetails - An object containing the email to validate.
 * @param {string} emailDetails.email - The email address to validate.
 * @throws {Error} Throws an error if the email format is invalid.
 */

async function ValidateEmail({ email }) {
  // check if email is valid using regex based on declaration
  if (!emailRegex.test(email)) {
    // if email not valid, then throw an error
    const error = new Error('Parameter email tidak sesuai format');
    error.status = 400;
    throw error;
  }
}

/**
 * Validates the password according to length and presence.
 *
 * This function checks if the password is provided and has at least 8 characters.
 * Throws an error if validation fails.
 *
 * @async
 * @function ValidatePassword
 * @param {Object} passwordDetails - An object containing the password to validate.
 * @param {string} passwordDetails.password - The password to validate.
 * @throws {Error} Throws an error if the password is invalid or too short.
 */
async function ValidatePassword({ password }) {
  // if password is not exist and password is not long than 8 charaters, return error
  if (!password || password?.length < 8) {
    const error = new Error('Parameter password tidak sesuai format');
    error.status = 400;
    throw error;
  }
}

/**
 * Validates that a required input is provided.
 *
 * This function checks if a value is present and throws an error if it is missing.
 * A custom field name can be provided for more descriptive error messages.
 *
 * @async
 * @function ValidateRequiredInput
 * @param {Object} inputDetails - An object containing the value and field name.
 * @param {string} inputDetails.value - The input value to validate.
 * @param {string} [inputDetails.field_name='input'] - The name of the field being validated (used in the error message).
 * @throws {Error} Throws an error if the value is missing or empty.
 */
async function ValidateRequiredInput({ value, field_name = 'input' }) {
  // if value is empty, then throw error with field name
  if (!value) {
    const error = new Error(`Parameter ${field_name} tidak boleh kosong`);
    error.status = 400;
    throw error;
  }
}

/**
 * Upload a single file (image) to Cloudinary.
 *
 * This function validates the file type, generates a unique public ID, uploads the file to Cloudinary,
 * and then deletes the file from the local storage.
 *
 * @async
 * @function UploadSingleFile
 * @param {Object} params - The parameters for the file upload.
 * @param {Object} params.file - The file to upload, which must have a valid mimetype.
 * @returns {Object} The result of the Cloudinary upload.
 *
 * @throws {Error} Throws an error if:
 * - The file type is not valid (status 400).
 * - Any other error occurs during the upload process (status 500).
 */
async function UploadSingleFile({ file }) {
  try {
    // set valid types for upload file
    const validTypes = ['image/jpeg', 'image/png'];

    // check if file type is valid
    if (!validTypes.includes(file.mimetype)) {
      // throw error
      const error = new Error('Format Image tidak sesuai');
      error.status = 400;
      throw error;
    }

    // generate uuid for public id
    const UUID = generateUUID();

    // upload file to cloudinary
    const uploadResult = await cloudinary.uploader.upload(file.path, {
      resource_type: 'image',
      folder: 'user_profile_images', // Folder in Cloudinary
      public_id: `profile_${UUID}`, // Use the user's email as part of the public ID to make it unique
    });

    // remove file local
    fs.unlinkSync(file.path);

    // return result upload
    return uploadResult;
  } catch (error) {
    // log the error
    console.log(error);

    throw new Error(error.message);
  }
}

function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export {
  CreateSalt,
  GenerateHashedPassword,
  ValidateEmail,
  ValidatePassword,
  ValidateRequiredInput,
  UploadSingleFile,
  generateUUID,
};
