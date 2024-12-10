import { GetAllServices } from '../services/service.service.js';

/**
 * Controller function to handle the request for fetching all services.
 *
 * This function calls the `GetAllServices` service to retrieve the available services from the database,
 * and then returns the services in the response. If an error occurs, it logs the error and responds with
 * an appropriate error message and status code.
 *
 * @async
 * @function GetAllServicesController
 * @param {Object} req - The request object from the client.
 * @param {Object} res - The response object used to send the API response.
 * @returns {Promise<void>} A promise that resolves when the response is sent.
 *
 * @throws {Error} If the `GetAllServices` function throws an error, it will be caught and an error response is sent.
 */

async function GetAllServicesController(req, res) {
  try {
    // call service get all services
    const services = await GetAllServices();

    // return respond from services
    res.status(200).json(services);
  } catch (error) {
    // log the error
    console.error('Error in GetAllServicesController:', error);

    // return error to api
    res.status(500).json({
      status: 102,
      message: 'Failed to retrieve services',
      data: null,
    });
  }
}

export { GetAllServicesController };
