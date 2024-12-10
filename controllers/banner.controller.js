import { GetAllBanners } from '../services/banner.service.js';

/**
 * Controller function to handle the request for fetching all active banners.
 *
 * This function calls the `GetAllBanners` service to retrieve the active banners from the database,
 * and then returns the banners in the response. If an error occurs, it logs the error and responds with
 * an appropriate error message and status code.
 *
 * @async
 * @function GetAllBannersController
 * @param {Object} req - The request object from the client.
 * @param {Object} res - The response object used to send the API response.
 * @returns {Promise<void>} A promise that resolves when the response is sent.
 *
 * @throws {Error} If the `GetAllBanners` function throws an error, it will be caught and an error response is sent.
 */

async function GetAllBannersController(req, res) {
  try {
    // get all data banners from database
    const banners = await GetAllBanners();

    // return respond from banners
    res.status(200).json(banners);
  } catch (error) {
    // log the error
    console.error('Error in GetAllBannersController:', error);

    // return error to api
    res.status(500).json({
      status: 102,
      message: 'Failed to retrieve banners',
      data: null,
    });
  }
}

export { GetAllBannersController };
