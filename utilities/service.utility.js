import ServiceModel from '../models/service.model.js';

/**
 * Function to retrieve a service based on its unique service code.
 *
 * This function queries the database to find a service that matches the provided service code.
 *
 * @async
 * @function GetOneServiceBasedOnServiceCode
 * @param {Object} params - Parameters required for the query.
 * @param {string} params.service_code - The unique code of the service to retrieve.
 * @returns {Promise<Object|null>} A promise that resolves to the service object if found,
 * or `null` if no service matches the provided service code.
 *
 * @example
 * const service = await GetOneServiceBasedOnServiceCode({ service_code: 'SVC123' });
 * console.log(service);
 */

async function GetOneServiceBasedOnServiceCode({ service_code }) {
  // find service based on service code
  const service = await ServiceModel.findOne({ service_code }).lean();

  // return service
  return service;
}

export { GetOneServiceBasedOnServiceCode };
