import { GenerateQueryMongoDB } from '../utilities/common.utility.js';

/**
 * Get a service based on its service code.
 *
 * This function retrieves a single service from the database using the provided service code.
 * It queries the 'services' collection to find the service matching the given service code.
 *
 * @async
 * @function
 *
 * @param {Object} params - The function parameters.
 * @param {string} params.service_code - The unique service code used to identify the service.
 *
 * @returns {Promise<Object|null>} A promise that resolves to the service object if found, or null if not found.
 *
 * @throws {Error} Throws an error if there is an issue with the query execution.
 *
 * @example
 * const service = await GetOneServiceBasedOnServiceCode({ service_code: 'SVC123' });
 * console.log(service);
 * // Example response:
 * // {
 * //   service_code: 'SVC123',
 * //   service_name: 'Service A',
 * //   service_tariff: 100,
 * //   service_icon: 'icon_url',
 * // }
 *
 * // If service is not found:
 * // null
 */

async function GetOneServiceBasedOnServiceCode({ service_code }) {
  const parameterQuery = { service_code };
  // find service based on service code
  const service = await GenerateQueryMongoDB({
    collection_name: 'services',
    query: 'findOne',
    parameter: parameterQuery,
  });

  // return service
  return service;
}

export { GetOneServiceBasedOnServiceCode };
