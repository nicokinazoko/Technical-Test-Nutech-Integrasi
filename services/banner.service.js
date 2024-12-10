import BannerModel from '../models/banner.model.js';

/**
 * Fetches all active banners from the database.
 *
 * This function queries the `BannerModel` for all documents where the `status` is 'active',
 * and returns a structured response with the banner data, excluding the `_id` field.
 * In case of an error, the function logs the error and throws an error with the message.
 *
 * @async
 * @function GetAllBanners
 * @returns {Promise<Object>} A promise that resolves to an object containing the following properties:
 *   - `status` {number} - A status code indicating success (0 for success).
 *   - `message` {string} - A message indicating the outcome (e.g., 'Sukses' for success).
 *   - `data` {Array<Object>} - An array of banner objects with active status.
 *
 * @throws {Error} Throws an error if the database query fails or an error occurs.
 */

async function GetAllBanners() {
  try {
    // find banners
    const banners = await BannerModel.find({ status: 'active' })
      .select('-_id')
      .lean();

    // return banners
    return {
      status: 0,
      message: 'Sukses',
      data: banners,
    };
  } catch (error) {
    console.log('Error GetAllBanners', error);
    throw new Error(error.message);
  }
}

export { GetAllBanners };
