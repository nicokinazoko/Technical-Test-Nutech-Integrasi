import { GenerateQueryMongoDB } from '../utilities/common.utility.js';

/**
 * Retrieves all active banners from the database.
 *
 * This function queries the 'banners' collection to find all banners with a status of 'active'.
 * The banners are mapped to include specific fields: `banner_name`, `banner_image`, and `description`.
 *
 * @async
 * @function
 *
 * @returns {Promise<Object>} A promise that resolves to an object containing the status, message, and a list of banners.
 *
 * @throws {Error} Throws an error if the query fails or an exception occurs.
 *
 * @example
 * const banners = await GetAllBanners();
 * console.log(banners);
 * // Example response:
 * // {
 * //   status: 0,
 * //   message: 'Sukses',
 * //   data: [
 * //     {
 * //       banner_name: 'Summer Sale',
 * //       banner_image: 'https://example.com/banner1.jpg',
 * //       description: 'Discounts up to 50%',
 * //     },
 * //     {
 * //       banner_name: 'New Arrivals',
 * //       banner_image: 'https://example.com/banner2.jpg',
 * //       description: 'Check out the latest collection',
 * //     },
 * //   ],
 * // }
 */

async function GetAllBanners() {
  try {
    // set parameter query to find
    const parameterQuery = { status: 'active' };

    // find banners
    const banners = await GenerateQueryMongoDB({
      collection_name: 'banners',
      query: 'find',
      parameter: parameterQuery,
    });

    // return banners
    return {
      status: 0,
      message: 'Sukses',
      data: banners.map((banner) => {
        return {
          banner_name: banner?.banner_name || '',
          banner_image: banner?.banner_image || '',
          description: banner?.description || '',
        };
      }),
    };
  } catch (error) {
    console.log('Error GetAllBanners', error);
    throw new Error(error.message);
  }
}

export { GetAllBanners };
