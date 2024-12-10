import bcrypt from 'bcrypt';
import cloudinary from 'cloudinary';
import fs from 'fs';
import { db } from '../db/config.js';

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

/**
 * Generates a UUID (Universally Unique Identifier) version 4.
 *
 * This function creates a random UUID in the format `xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx`,
 * where `x` represents random hexadecimal digits, and `y` is a value from 8, 9, A, or B.
 *
 * @function
 *
 * @returns {string} A randomly generated UUID string.
 *
 * @example
 * const uuid = generateUUID();
 * console.log(uuid); // Example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479'
 */

function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Executes various MongoDB queries with support for create, find, update, and other operations.
 *
 * This function is a dynamic MongoDB query handler designed to support multiple operations such as
 * creating documents, finding documents with filters and pagination, updating documents, and finding
 * and updating a document by ID.
 *
 * @async
 * @function
 *
 * @param {Object} params - The input parameters for the query.
 * @param {string} params.collection_name - The name of the MongoDB collection to query.
 * @param {string} params.query - The type of query to execute (e.g., 'create', 'find', 'update', etc.).
 * @param {Object} [params.parameter] - The filter criteria for 'find', 'findOne', or 'update' queries.
 * @param {Object} [params.data] - The data to insert or update in the collection.
 * @param {Object} [params.sort] - The sorting criteria for 'find' queries (e.g., { createdAt: -1 }).
 * @param {Object} [params.pagination] - The pagination details for 'find' queries.
 * @param {number} [params.pagination.offset] - The page offset for pagination.
 * @param {number} [params.pagination.limit] - The number of documents to return per page.
 *
 * @returns {Object|Array} The result of the query, which may vary depending on the operation type:
 * - 'create': The inserted document details.
 * - 'find': An array of matching documents.
 * - 'update': The update operation's result.
 * - 'findByIdAndUpdate': The updated document.
 * - 'findOne': The single matching document.
 *
 * @throws {Error} Throws an error if the query type is unsupported or if the query fails.
 *
 * @example
 * // Create a new document
 * const result = await GenerateQueryMongoDB({
 *   collection_name: 'users',
 *   query: 'create',
 *   data: { name: 'John Doe', age: 30 },
 * });
 *
 * // Find documents with sorting and pagination
 * const result = await GenerateQueryMongoDB({
 *   collection_name: 'users',
 *   query: 'find',
 *   parameter: { age: { $gte: 18 } },
 *   sort: { createdAt: -1 },
 *   pagination: { offset: 0, limit: 10 },
 * });
 *
 * // Update a document
 * const result = await GenerateQueryMongoDB({
 *   collection_name: 'users',
 *   query: 'update',
 *   parameter: { _id: userId },
 *   data: { age: 31 },
 * });
 */

async function GenerateQueryMongoDB({
  collection_name,
  query,
  parameter,
  data,
  sort,
  pagination,
}) {
  // Access the correct collection
  const collection = db.collection(collection_name);

  // define timestamp for createdAt and updatedAt
  const timestamp = new Date();

  let result;

  try {
    // Determine which query to run based on the 'query' type
    if (query === 'create') {
      // add field created at and updated at
      const documentWithTimestamps = {
        ...data,
        createdAt: timestamp,
        updatedAt: timestamp,
      };
      // Insert one document
      result = await collection.insertOne(documentWithTimestamps);
    } else if (query === 'find') {
      // Find documents matching the parameter (filter)
      result = collection.find(parameter);

      // Apply sorting if needed
      if (sort) {
        result = result.sort(sort); // Sorting by given field(s)
      }

      // Apply pagination if provided
      if (pagination && pagination.offset && pagination.limit) {
        result = result
          .skip(pagination.offset * pagination.limit) // Skipping for pagination
          .limit(pagination.limit); // Limit number of results
      }

      // Execute the query and get the results as an array
      result = await result.toArray();
    } else if (query === 'update') {
      // add field updatedAt
      const updateWithTimestamp = {
        ...data,
        updatedAt: timestamp,
      };
      // Update one document that matches the 'parameter'
      result = await collection.updateOne(parameter, {
        $set: updateWithTimestamp,
      });
    } else if (query === 'findByIdAndUpdate') {
      // add field updatedAt
      const updateWithTimestamp = {
        ...data,
        updatedAt: timestamp,
      };

      // Find a document by ID and update it
      result = await collection.findOneAndUpdate(
        parameter,
        { $set: updateWithTimestamp },
        { returnDocument: 'after' }
      );
    } else if (query === 'findOne') {
      // Find a single document that matches the 'parameter'
      // result = collection.findOne(parameter);
      result = collection.findOne(parameter);
    } else {
      // Throw an error for unsupported queries
      throw new Error(`Unsupported query type: ${query}`);
    }

    // Return the result of the query
    return result;
  } catch (error) {
    // Handle and log errors appropriately
    console.error('Error executing query:', error);
    throw new Error(error.message); // Re-throw the error for the caller
  }
}

export {
  CreateSalt,
  GenerateHashedPassword,
  ValidateEmail,
  ValidatePassword,
  ValidateRequiredInput,
  UploadSingleFile,
  generateUUID,
  GenerateQueryMongoDB,
};
